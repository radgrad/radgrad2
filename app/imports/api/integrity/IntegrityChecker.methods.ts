import { Meteor } from 'meteor/meteor';
import * as _ from 'lodash';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { checkIntegrity } from './IntegrityChecker';
import { ROLE } from '../role/Role';
import { Users } from '../user/UserCollection';

/**
 * The check integrity ValidatedMethod.
 * @memberOf api/integrity
 */
export const checkIntegrityMethod = new ValidatedMethod({
  name: 'IntegrityCheck',
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to check integrity.');
    } else {
      const profile = Users.getProfile(this.userId);
      if (!_.includes([ROLE.ADMIN, ROLE.ADVISOR], profile.role)) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to check integrity.');
      }
    }
    return checkIntegrity();
  },
});
