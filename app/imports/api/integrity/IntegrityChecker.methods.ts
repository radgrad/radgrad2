import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { checkIntegrity } from './IntegrityChecker';
import { ROLE } from '../role/Role';

/**
 * The check integrity ValidatedMethod.
 * @memberOf api/integrity
 */
export const checkIntegrityMethod = new ValidatedMethod({
  name: 'IntegrityCheck',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to check integrity.');
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to check integrity.');
    }
    const integrityData = checkIntegrity();
    // Print out integrity results to server console because the websocket might close and results of server-side check
    // might not be communicated back to the client.
    if (Meteor.isServer) {
      console.log(integrityData.message);
    }
    return integrityData;
  },
});
