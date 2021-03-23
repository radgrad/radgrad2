import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import { StudentProfiles } from './StudentProfileCollection';

interface StudentPublicData {
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
export const getStudentPublicData = new ValidatedMethod({
  name: 'StudentProfileCollection.getStudentPublicData',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ username }) {
    const publicData: StudentPublicData = {};
    if (Meteor.isServer) {
      const profile = StudentProfiles.findByUsername(username);
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
