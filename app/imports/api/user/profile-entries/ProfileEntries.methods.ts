import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import _ from 'lodash';
import { RadGrad } from '../../radgrad/RadGrad';
import { PROFILE_ENTITY_COLLECTIONS } from './ProfileEntryTypes';

export const getProfileForecast = new ValidatedMethod({
  name: 'ProfileInterest.forecast',
  mixins: [CallPromiseMixin],
  validate: null,
  run(collectionName: PROFILE_ENTITY_COLLECTIONS) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get profile entries.');
    }
    if (Meteor.isServer) {
      const collection = RadGrad.getCollection(collectionName);
      const items = collection.findNonRetired({});
      let ids;
      switch (collectionName) {
        case PROFILE_ENTITY_COLLECTIONS.CAREER_GOALS:
          ids = _.uniq(items.map((item) => item.careerGoalID));
          return ids.map((id) => ({ _id: id, count: collection.findNonRetired({ careerGoalID: id }).length }));
        case PROFILE_ENTITY_COLLECTIONS.COURSES:
          ids = items.map((item) => item.courseID);
          return ids.map((id) => ({ _id: id, count: collection.findNonRetired({ courseID: id }).length }));
        case PROFILE_ENTITY_COLLECTIONS.INTERESTS:
          ids = items.map((item) => item.interestID);
          return ids.map((id) => ({ _id: id, count: collection.findNonRetired({ interestID: id }).length }));
        case PROFILE_ENTITY_COLLECTIONS.OPPORTUNITIES:
          ids = items.map((item) => item.opportunityID);
          return ids.map((id) => ({ _id: id, count: collection.findNonRetired({ opportunityID: id }).length }));
      }
    }
    return [];
  },
});
