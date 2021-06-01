import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { RadGradForecasts, ENROLLMENT_TYPE } from '../../startup/both/RadGradForecasts';

export const getFutureEnrollmentSingleMethod = new ValidatedMethod({
  name: 'Forecast.getFutureEnrollmentSingle',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ id, type }) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get profile entries.');
    }
    if (Meteor.isServer) {
      switch (type) {
        case ENROLLMENT_TYPE.COURSE:
          return RadGradForecasts.getCourseForecast(id);
        case ENROLLMENT_TYPE.OPPORTUNITY:
          return RadGradForecasts.getOpportunityForecast(id);
      }
    }
    return {};
  },
});

export const getFutureEnrollmentMethod = new ValidatedMethod({
  name: 'Forecast.getFutureEnrollment',
  mixins: [CallPromiseMixin],
  validate: null,
  run(type: ENROLLMENT_TYPE) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get forecast.');
    }
    if (Meteor.isServer) {
      switch (type) {
        case ENROLLMENT_TYPE.COURSE: {
          return RadGradForecasts.getCoursesForecast();
        }
        case ENROLLMENT_TYPE.OPPORTUNITY: {
          return RadGradForecasts.getOpportunitiesForecast();
        }
      }
    }
    return [];
  },
});
