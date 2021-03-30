import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {Users} from './UserCollection';
import {CareerGoals} from '../career/CareerGoalCollection';
import {StudentProfiles} from './StudentProfileCollection';
import {ProfileCareerGoals} from './profile-entries/ProfileCareerGoalCollection';
import {ProfileInterests} from './profile-entries/ProfileInterestCollection';

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
        const profileDocs = ProfileCareerGoals.findNonRetired({userID});
        const careerGoalSlugs = profileDocs.map(doc => CareerGoals.findSlugByID(doc.careerGoalID));
        console.log(careerGoalSlugs);
        publicData.careerGoals = profileDocs.map(doc => CareerGoals.findSlugByID(doc.careerGoalID));
      }
      if (profile.shareInterests) {
        const profileDocs = ProfileInterests.findNonRetired({userID});
        // publicData.interests = profileDocs.map(doc => ProfileInterests.getInterestSlug(doc));
      }
      if (profile.shareCourses) {
        publicData.courses = profile.courses;
      }
      if (profile.shareOpportunities) {
        publicData.opportunities = profile.opportunities;
      }
    }
    return publicData;
  },
});
