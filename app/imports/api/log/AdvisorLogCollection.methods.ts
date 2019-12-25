import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import _ from 'lodash';
import { AdvisorLogs } from './AdvisorLogCollection';
import { ROLE } from '../role/Role';
import { IAdvisorLogUpdate } from '../../typings/radgrad'; // eslint-disable-line
import { Users } from '../user/UserCollection';

/**
 * The validated method for defining AdvisorLogs.
 * @memberOf api/log
 */
export const advisorLogsDefineMethod = new ValidatedMethod({
  name: 'AdvisorLogs.define',
  validate: null,
  run(definition) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Advisor logs.');
    }
    const profile = Users.getProfile(this.userId);
    if (!_.includes([ROLE.ADMIN, ROLE.ADVISOR], profile.role)) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as ADMIN or ADVISOR to define Advisor logs.');
    }
    return AdvisorLogs.define(definition);
  },
});

/**
 * The ValidatedMethod for updating AdvisorLogs.
 * @memberOf api/log
 */
export const advisorLogsUpdateMethod = new ValidatedMethod({
  name: 'AdvisorLogs.update',
  validate: null,
  run(update: IAdvisorLogUpdate) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update AdvisorLogs.');
    }
    const profile = Users.getProfile(this.userId);
    if (!_.includes([ROLE.ADMIN, ROLE.ADVISOR], profile.role)) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to update AdvisorLogs.');
    }
    return AdvisorLogs.update(update.id, update);
  },
});

/**
 * The validated method for removing AdvisorLogs.
 * @memberOf api/log
 */
export const AdvisorLogsRemoveItMethod = new ValidatedMethod({
  name: 'AdvisorLogs.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to remove AdvisorLogs.');
    }
    const profile = Users.getProfile(this.userId);
    if (!_.includes([ROLE.ADMIN, ROLE.ADVISOR], profile.role)) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to remove AdvisorLogs.');
    }
    return AdvisorLogs.removeIt(removeArgs.id);
  },
});
