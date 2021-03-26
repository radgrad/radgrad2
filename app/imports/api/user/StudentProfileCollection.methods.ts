import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {Users} from './UserCollection';
import {StudentProfiles} from './StudentProfileCollection';

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
    console.log('in getPublicProfileData');
    const publicData: PublicProfileData = {};
    if (Meteor.isServer) {
      const profile = Users.getProfile(username);
      console.log('oooooo', username);
      if (username === 'abi@hawaii.edu') {
        console.log('setting');
        profile.sharePicture = true;
        profile.shareLevel = true;
        profile.shareICE = true;
        profile.shareInterests = true;
        profile.shareCareerGoals = true;
      }
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
        publicData.careerGoals = profile.careerGoals;
      }
      if (profile.shareInterests) {
        publicData.interests = profile.interests;
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
