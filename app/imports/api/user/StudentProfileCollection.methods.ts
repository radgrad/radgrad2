import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Meteor } from 'meteor/meteor';
import { StudentProfile } from '../../typings/radgrad';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { RadGradProperties } from '../radgrad/RadGradProperties';
import { Users } from './UserCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { StudentProfiles } from './StudentProfileCollection';
import { FacultyProfiles } from './FacultyProfileCollection';
import { AdvisorProfiles } from './AdvisorProfileCollection';
import { AdminProfiles } from './AdminProfileCollection';
import { ProfileCareerGoals } from './profile-entries/ProfileCareerGoalCollection';
import { ProfileInterests } from './profile-entries/ProfileInterestCollection';
import { Interests } from '../interest/InterestCollection';
import { ProfileCourses } from './profile-entries/ProfileCourseCollection';
import { Courses } from '../course/CourseCollection';
import { ProfileOpportunities } from './profile-entries/ProfileOpportunityCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { ROLE } from '../role/Role';

export interface PublicProfileData {
  website?: string,
  picture?: string,
  level?: number,
  ice?: { i, c, e },
  careerGoals?: string[],
  interests?: string[],
  courses?: string[],
  opportunities?: string[]
}

/**
 * Helper function to create and return an object with fields for all the publicly shared profile data for username.
 * @param username The user who's public data is to be shared.
 * @returns {PublicProfileData}
 */
const generatePublicProfileDataObject = (username) => {
  const publicData: PublicProfileData = {};
  if (Meteor.isServer) {
    const profile = Users.getProfile(username);
    const userID = Users.getID(username);
    // Advisors, Faculty, Admins always share picture, website, interests, career goals.
    // CAM but that's not true look at their ProfileLabel.
    // const autoShare = (profile.role !== ROLE.STUDENT);
    if (profile.sharePicture /* || autoShare */) {
      publicData.picture = profile.picture;
    }
    if (profile.shareWebsite /* || autoShare */) {
      publicData.website = profile.website;
    }
    if (profile.shareLevel) {
      publicData.level = profile.level;
    }
    if (profile.shareICE) {
      // if shareICE exists, then the user must be a student.
      publicData.ice = StudentProfiles.getEarnedICE(username);
    }
    if (profile.shareCareerGoals /* || autoShare */) {
      const profileDocs = ProfileCareerGoals.findNonRetired({ userID });
      publicData.careerGoals = profileDocs.map(doc => CareerGoals.findSlugByID(doc.careerGoalID));
    }
    if (profile.shareInterests /* || autoShare */) {
      const profileDocs = ProfileInterests.findNonRetired({ userID });
      publicData.interests = profileDocs.map(doc => Interests.findSlugByID(doc.interestID));
    }
    if (profile.shareCourses) {
      const profileDocs = ProfileCourses.findNonRetired({ studentID: userID });
      publicData.courses = profileDocs.map(doc => Courses.findSlugByID(doc.courseID));
    }
    if (profile.shareOpportunities) {
      const profileDocs = ProfileOpportunities.findNonRetired({ studentID: userID });
      publicData.opportunities = profileDocs.map(doc => Opportunities.findSlugByID(doc.opportunityID));
    }
  }
  return publicData;
};

/**
 * Meteor method used to retrieve public data for a student profile card.
 * Returns an object with fields containing the visible profile data.
 */
export const getPublicProfileData = new ValidatedMethod({
  name: 'ProfileCollection.getPublicProfileData',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ username }) {
    return generatePublicProfileDataObject(username);
  },
});

/**
 * Meteor method to set a Profile field (usually a "share" field).
 * After setting the share value, generates and returns an object with fields containing the visible profile data.
 */
export const setPublicProfileData = new ValidatedMethod({
  name: 'ProfileCollection.setPublicProfileData',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ username, fieldName, fieldValue }) {
    // console.log(username, fieldName, fieldValue);
    if (Meteor.isServer) {
      const profile = Users.getProfile(username);
      let profileCollection;
      if (profile.role === ROLE.STUDENT) {
        profileCollection = StudentProfiles;
      } else if (profile.role === ROLE.FACULTY) {
        profileCollection = FacultyProfiles;
      } else if (profile.role === ROLE.ADVISOR) {
        profileCollection = AdvisorProfiles;
      } else {
        profileCollection = AdminProfiles;
      }
      const updateObject = {};
      updateObject[fieldName] = fieldValue;
      profileCollection.update(profile._id, updateObject);
    }
    // Now that we've updated the profile collection's share field, generate the new set of public data and return.
    return generatePublicProfileDataObject(username);
  },
});

export const getLastAcademicTermMethod = new ValidatedMethod({
  name: 'StudentProfile.getLastAcademicTerm',
  mixins: [CallPromiseMixin],
  validate: null,
  run(user: string) {
    if (Meteor.isServer) {
      return StudentProfiles.getLastAcademicTerm(user);
    }
    return null;
  },
});

const updateStudentToAlumni = (student: StudentProfile): boolean => {
  const oneYearInTerms = RadGradProperties.getQuarterSystem() ? 4 : 3;
  const currentTermNumber = AcademicTerms.getCurrentAcademicTermNumber();
  const studentLastTermNumber = StudentProfiles.getLastAcademicTerm(student.username).termNumber;
  if (currentTermNumber > studentLastTermNumber + oneYearInTerms) {
    StudentProfiles.update(student._id, { isAlumni: true });
    return true;
  }
  return false;
};

export const updateStudentToAlumniMethod = new ValidatedMethod({
  name: 'StudentProfile.updateStudentToAlumni',
  mixins: [CallPromiseMixin],
  validate: null,
  run(user: string) {
    if (Meteor.isServer) {
      const profile = Users.getProfile(user);
      if (updateStudentToAlumni(profile)) {
        return `${user}'s last academic term was over a year ago.`;
      }
      return `${user} is still current`;
    }
    return '';
  },
});

export const updateAllStudentsToAlumniMethod = new ValidatedMethod({
  name: 'StudentProfile.updateAllStudentsToAlumni',
  mixins: [CallPromiseMixin],
  validate: null,
  run(user: string) {
    if (Meteor.isServer) {
      const students = StudentProfiles.find({ isAlumni: false }).fetch();
      let count = 0;
      students.forEach((student) => {
        if (updateStudentToAlumni(student)) {
          count++;
        }
      });
      return `${count} students moved to alumni`;
    }
    return '';
  },
});

const retireOldStudent = (student: StudentProfile): boolean => {
  const twoYearInTerms = RadGradProperties.getQuarterSystem() ? 8 : 6;
  const currentTermNumber = AcademicTerms.getCurrentAcademicTermNumber();
  const studentLastTermNumber = StudentProfiles.getLastAcademicTerm(student.username).termNumber;
  if (currentTermNumber > studentLastTermNumber + twoYearInTerms) {
    StudentProfiles.update(student._id, { retired: true });
    return true;
  }
  return false;
};

export const retireOldStudentMethod = new ValidatedMethod({
  name: 'StudentProfile.retireOldStudent',
  mixins: [CallPromiseMixin],
  validate: null,
  run(student: string) {
    if (Meteor.isServer) {
      const profile = Users.getProfile(student);
      if (retireOldStudent(profile)) {
        return `Retired ${student} because their last academic term was over two years ago.`;
      }
      return `${student} is still current.`;
    }
    return '';
  },
});

export const retireAllOldStudentsMethod = new ValidatedMethod({
  name: 'StudentProfile.retireAllOldStudents',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (Meteor.isServer) {
      const students = StudentProfiles.find({}).fetch();
      let count = 0;
      students.forEach((student) => {
        if (retireOldStudent(student)) {
          count++;
        }
      });
      return `Retired ${count} students.`;
    }
    return '';
  },
});

export const matriculateStudentMethod = new ValidatedMethod({
  name: 'StudentProfile.matriculateStudent',
  mixins: [CallPromiseMixin],
  validate: null,
  run(user: string) {
    if (Meteor.isServer) {
      StudentProfiles.assertValidRoleForMethod(this.userId);
      const profile = Users.getProfile(user);
      if (profile.role !== ROLE.STUDENT && profile.role !== ROLE.ALUMNI) {
        throw new Meteor.Error(`${user} isn't a student`, 'You can only matriculate students.');
      }
      // TODO Do we want to make sure they are alumni? What about their latest academic term needs to be N terms ago?
      StudentProfiles.removeIt(profile.username);
    }
  },
});
