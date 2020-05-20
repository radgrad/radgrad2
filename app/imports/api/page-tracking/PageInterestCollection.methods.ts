import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { PageInterests } from './PageInterestCollection';

/**
 * The validated method for defining PageInterests.
 * @memberOf api/page-tracking
 */
export const pageInterestDefineMethod = new ValidatedMethod({
  name: 'PageInterest.define',
  validate: null,
  mixins: [CallPromiseMixin],
  run(interactionData) {
    PageInterests.assertValidRoleForMethod(this.userId);
    return PageInterests.define(interactionData);
  },
});

/**
 * The validated method for removing PageInterests
 * @memberOf api/analytic
 */
export const pageInterestRemoveUserMethod = new ValidatedMethod({
  name: 'PageInterest.removeUser',
  validate: null,
  mixins: [CallPromiseMixin],
  run(instances) {
    PageInterests.assertAdminRoleForMethod(this.userId);
    return PageInterests.removeUser(instances);
  },
});

/**
 * The validated method for finding PageInterests.
 * @memberOf api/page-tracking
 */
export const pageInterestFindMethod = new ValidatedMethod({
  name: 'PageInterest.find',
  validate: null,
  mixins: [CallPromiseMixin],
  run({ selector, options }) {
    PageInterests.assertAdminRoleForMethod(this.userId);
    const results = PageInterests.find(selector, options);
    return results.fetch();
  },
});
