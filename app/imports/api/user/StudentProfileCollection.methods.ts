import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {Users} from './UserCollection';
import {CareerGoals} from '../career/CareerGoalCollection';
import {StudentProfiles} from './StudentProfileCollection';
import {ProfileCareerGoals} from './profile-entries/ProfileCareerGoalCollection';
import {ProfileInterests} from './profile-entries/ProfileInterestCollection';
import {Interests} from '../interest/InterestCollection';
import {Slugs} from "../slug/SlugCollection";
import {ProfileCourses} from "./profile-entries/ProfileCourseCollection";
import {Courses} from "../course/CourseCollection";
import {ProfileOpportunities} from "./profile-entries/ProfileOpportunityCollection";
import {Opportunities} from "../opportunity/OpportunityCollection";
import {ROLE} from "../role/Role";

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
 * Meteor method used to retrieve public data for a student profile card.
 * Returns an object with fields containing the visible student data.
 */
export const getPublicProfileData = new ValidatedMethod({
  name: 'ProfileCollection.getPublicProfileData',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ username }) {
    const publicData: PublicProfileData = {};
    if (Meteor.isServer) {
      const profile = Users.getProfile(username);
      const userID = Users.getID(username);
      // Advisors, Faculty, Admins always share picture, website, interests, career goals.
      const autoShare = (profile.role !== ROLE.STUDENT);
      if (profile.sharePicture || autoShare) {
        publicData.picture = profile.picture;
      }
      if (profile.shareWebsite || autoShare) {
        publicData.website = profile.website;
      }
      if (profile.shareLevel) {
        publicData.level = profile.level;
      }
      if (profile.shareICE) {
        // if shareICE exists, then the user must be a student.
        publicData.ice = StudentProfiles.getEarnedICE(username);
      }
      if (profile.shareCareerGoals || autoShare) {
        const profileDocs = ProfileCareerGoals.findNonRetired({userID});
        publicData.careerGoals = profileDocs.map(doc => CareerGoals.findSlugByID(doc.careerGoalID));
      }
      if (profile.shareInterests || autoShare) {
        const profileDocs = ProfileInterests.findNonRetired({userID});
        publicData.interests = profileDocs.map(doc => Interests.findSlugByID(doc.interestID));
      }
      if (profile.shareCourses) {
        const profileDocs = ProfileCourses.findNonRetired({studentID: userID});
        publicData.courses = profileDocs.map(doc => Courses.findSlugByID(doc.courseID));
      }
      if (profile.shareOpportunities) {
        const profileDocs = ProfileOpportunities.findNonRetired({studentID: userID});
        publicData.opportunities = profileDocs.map(doc => Opportunities.findSlugByID(doc.opportunityID));
      }
    }
    return publicData;
  },
});
