import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { UserInteractions } from './UserInteractionCollection';

/**
 * The validated method for defining UserInteractions.
 * @memberOf api/user-interaction
 */
export const userInteractionDefineMethod = new ValidatedMethod({
  name: 'UserInteraction.define',
  validate: null,
  mixins: [CallPromiseMixin],
  run(interactionData) {
    if (Meteor.isServer) {
      UserInteractions.assertValidRoleForMethod(this.userId);
      return UserInteractions.define(interactionData);
    }
    return null;
  },
});

/**
 * The validated method for removing UserInteractions.
 * @memberOf api/user-interaction
 */
export const userInteractionRemoveUserMethod = new ValidatedMethod({
  name: 'UserInteraction.removeUser',
  validate: null,
  mixins: [CallPromiseMixin],
  run(instances) {
    if (Meteor.isServer) {
      UserInteractions.assertAdminRoleForMethod(this.userId);
      return UserInteractions.removeUser(instances);
    }
    return null;
  },
});

/**
 * The validated method for finding UserInteractions.
 * @memberOf api/user-interaction
 */
export const userInteractionFindMethod = new ValidatedMethod({
  name: 'UserInteraction.find',
  validate: null,
  mixins: [CallPromiseMixin],
  run({ selector, options }) {
    if (Meteor.isServer) {
      UserInteractions.assertAdminRoleForMethod(this.userId);
      const results = UserInteractions.find(selector, options).fetch();
      return results;
    }
    return null;
  },
});
