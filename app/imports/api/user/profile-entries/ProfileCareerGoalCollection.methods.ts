import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import _ from 'lodash';
import { ProfileCareerGoals } from './ProfileCareerGoalCollection';

export const getProfileCareerGoalForecast = new ValidatedMethod({
  name: 'ProfileCareerGoal.forecast',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get profile entries.');
    }
    if (Meteor.isServer) {
      const profileCareerGoals = ProfileCareerGoals.findNonRetired({});
      const careerGoalIDs = _.uniq(profileCareerGoals.map((pc) => pc.careerGoalID));
      return careerGoalIDs.map((careerGoalID) => ({ careerGoalID, count: ProfileCareerGoals.findNonRetired({ careerGoalID }).length }));
    }
    return [];
  },
});
