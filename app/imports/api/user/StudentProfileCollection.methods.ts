import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { StudentProfile } from '../../typings/radgrad';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { RadGradProperties } from '../radgrad/RadGradProperties';
import { Reviews } from '../review/ReviewCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection';
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
  website?: string;
  picture?: string;
  level?: number;
  ice?: { i; c; e };
  careerGoals?: string[];
  interests?: string[];
  courses?: string[];
  opportunities?: string[];
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
    // Advisors, Faculty, Admins should share everything by default
    // when their accounts are created, but can manually opt-out if they want.
    if (profile.sharePicture) {
      publicData.picture = profile.picture;
    }
    if (profile.shareWebsite) {
      publicData.website = profile.website;
    }
    if (profile.shareLevel) {
      publicData.level = profile.level;
    }
    if (profile.shareICE) {
      // if shareICE exists, then the user must be a student.
      publicData.ice = StudentProfiles.getEarnedICE(username);
    }
    if (profile.shareCareerGoals) {
      const profileDocs = ProfileCareerGoals.findNonRetired({ userID });
      const careerGoalSlugs = profileDocs.map((doc) => CareerGoals.findSlugByID(doc.careerGoalID));
      publicData.careerGoals = CareerGoals.sort(careerGoalSlugs);
    }
    if (profile.shareInterests) {
      const profileDocs = ProfileInterests.findNonRetired({ userID });
      const interestSlugs = profileDocs.map((doc) => Interests.findSlugByID(doc.interestID));
      publicData.interests = Interests.sort(interestSlugs);
    }
    if (profile.shareCourses) {
      const profileDocs = ProfileCourses.findNonRetired({ userID });
      const courseSlugs = profileDocs.map((doc) => Courses.findSlugByID(doc.courseID));
      publicData.courses = Courses.sort(courseSlugs);
    }
    if (profile.shareOpportunities) {
      const profileDocs = ProfileOpportunities.findNonRetired({ userID });
      const opportunitySlugs = profileDocs.map((doc) => Opportunities.findSlugByID(doc.opportunityID));
      publicData.opportunities = Opportunities.sort(opportunitySlugs);
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
    if (Meteor.isServer) {
      return generatePublicProfileDataObject(username);
    }
    return null;
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
        throw new Meteor.Error(`${profile.username} isn't a student`, 'You can only matriculate students.');
      }
      if (!profile.retired) {
        throw new Meteor.Error(`${profile.username} isn't retired`, 'Retire the student first.');
      }
      StudentProfiles.removeIt(profile.username);
    }
  },
});

const buildStudentDumpObject = (studentUsernameOrID: string) => {
  const timestamp = new Date();
  const collections = [];
  const studentProfileCollection = {
    name: StudentProfiles.getCollectionName(),
    contents: [],
  };
  const profile = Users.getProfile(studentUsernameOrID);
  studentProfileCollection.contents.push(StudentProfiles.dumpOne(profile._id));
  collections.push(studentProfileCollection);
  const courseInstanceCollection = {
    name: CourseInstances.getCollectionName(),
    contents: CourseInstances.dumpUser(studentUsernameOrID),
  };
  collections.push(courseInstanceCollection);
  const opportunityInstanceCollection = {
    name: OpportunityInstances.getCollectionName(),
    contents: OpportunityInstances.dumpUser(studentUsernameOrID),
  };
  collections.push(opportunityInstanceCollection);
  const profileCareerGoalCollection = {
    name: ProfileCareerGoals.getCollectionName(),
    contents: ProfileCareerGoals.dumpUser(studentUsernameOrID),
  };
  collections.push(profileCareerGoalCollection);
  const profileCourseCollection = {
    name: ProfileCourses.getCollectionName(),
    contents: ProfileCourses.dumpUser(studentUsernameOrID),
  };
  collections.push(profileCourseCollection);
  const profileInterestCollection = {
    name: ProfileInterests.getCollectionName(),
    contents: ProfileInterests.dumpUser(studentUsernameOrID),
  };
  collections.push(profileInterestCollection);
  const profileOpportunityCollection = {
    name: ProfileOpportunities.getCollectionName(),
    contents: ProfileOpportunities.dumpUser(studentUsernameOrID),
  };
  collections.push(profileOpportunityCollection);
  const reviewCollection = {
    name: Reviews.getCollectionName(),
    contents: Reviews.dumpUser(studentUsernameOrID),
  };
  collections.push(reviewCollection);
  const verificationCollection = {
    name: VerificationRequests.getCollectionName(),
    contents: VerificationRequests.dumpUser(studentUsernameOrID),
  };
  collections.push(verificationCollection);
  return { timestamp, collections };
};

export const dumpStudentMethod = new ValidatedMethod({
  name: 'StudentProfile.dumpStudent',
  mixins: [CallPromiseMixin],
  validate: null,
  run(studentUsernameOrID: string) {
    if (Meteor.isServer) {
      StudentProfiles.assertValidRoleForMethod(this.userId);
      const profile = Users.getProfile(studentUsernameOrID);
      if (profile.role !== ROLE.STUDENT && profile.role !== ROLE.ALUMNI) {
        throw new Meteor.Error(`${profile.username} isn't a student`, 'You can only dump students.');
      }
      return buildStudentDumpObject(studentUsernameOrID);
    }
    return {};
  },
});

const shouldMatriculate = (studentProfile: StudentProfile): boolean => {
  const threeYearInTerms = RadGradProperties.getQuarterSystem() ? 12 : 9;
  const currentTermNumber = AcademicTerms.getCurrentAcademicTermNumber();
  const studentLastTermNumber = StudentProfiles.getLastAcademicTerm(studentProfile.username).termNumber;
  return currentTermNumber > studentLastTermNumber + threeYearInTerms;
};

const getStudentsToMatriculate = (): string[] => {
  const students = StudentProfiles.find({}).fetch();
  const threeYearInTerms = RadGradProperties.getQuarterSystem() ? 12 : 9;
  const currentTermNumber = AcademicTerms.getCurrentAcademicTermNumber();
  const retVal = [];
  students.forEach((student) => {
    const studentLastTermNumber = StudentProfiles.getLastAcademicTerm(student.username).termNumber;
    if (currentTermNumber > studentLastTermNumber + threeYearInTerms) {
      retVal.push(student.username);
    }
  });
  return retVal;
};

export const matriculateAllOldStudentsMethod = new ValidatedMethod({
  name: 'StudentProfiles.matriculateAllOldStudents',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (Meteor.isServer) {
      StudentProfiles.assertValidRoleForMethod(this.userId);
      const studentsToMatriculate = getStudentsToMatriculate();
      const retVal = [];
      const mDate = moment().format('YYYY-MM-DD');
      studentsToMatriculate.forEach((student) => {
        const fileName = `${student}-${mDate}`;
        const record = {
          fileName,
          contents: buildStudentDumpObject(student),
        };
        retVal.push(record);
        StudentProfiles.removeIt(student);
      });
    }
  },
});

export const updateAllStudentsStatusMethod = new ValidatedMethod({
  name: 'StudentProfiles.updateAllStudentsStatus',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (Meteor.isServer) {
      StudentProfiles.assertValidRoleForMethod(this.userId);
      const students = StudentProfiles.find({}).fetch();
      let alumniCount = 0;
      let retiredCount = 0;
      let matriculatedCount = 0;
      const studentRecords = [];
      const mDate = moment().format('YYYY-MM-DD');
      students.forEach((student) => {
        if (updateStudentToAlumni(student)) {
          alumniCount++;
        }
        if (retireOldStudent(student)) {
          retiredCount++;
        }
        if (shouldMatriculate(student)) {
          matriculatedCount++;
          const fileName = `${student.username}-${mDate}`;
          const record = {
            fileName,
            contents: buildStudentDumpObject(student.username),
          };
          studentRecords.push(record);
          StudentProfiles.removeIt(student);
        }
      });
      return {
        alumniCount,
        retiredCount,
        matriculatedCount,
        studentRecords,
      };
    }
    return {};
  },
});

export const findOddStudentsMethod = new ValidatedMethod({
  name: 'StudentProfiles.findOddStudents',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    const retVal = [];
    if (Meteor.isServer) {
      StudentProfiles.assertValidRoleForMethod(this.userId);
      const students = StudentProfiles.find({}).fetch();
      students.forEach((student) => {
        const studentID = student.userID;
        const cis = CourseInstances.find({ studentID }).fetch();
        const ois = OpportunityInstances.find({ studentID }).fetch();
        if (cis.length === 0 && ois.length === 0) {
          retVal.push(student);
        }
      });
      return retVal;
    }
    return retVal;
  },
});
