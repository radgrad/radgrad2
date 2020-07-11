import { ValidatedMethod } from 'meteor/maestroqadev:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { PageInterests } from './PageInterestCollection';
import { IPageInterest } from '../../typings/radgrad';

/**
 * The validated method for defining PageInterests.
 * @memberOf api/page-tracking
 */
export const pageInterestDefineMethod = new ValidatedMethod({
  name: 'PageInterest.define',
  validate: null,
  mixins: [CallPromiseMixin],
  run(definitionData: IPageInterest) {
    PageInterests.assertValidRoleForMethod(this.userId);
    return PageInterests.define(definitionData);
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
  run(username) {
    PageInterests.assertAdminRoleForMethod(this.userId);
    return PageInterests.removeUser(username);
  },
});

/**
 * The validated method for finding PageInterests.
 * @memberOf api/page-tracking
 */
export const pageInterestAdminFindMethod = new ValidatedMethod({
  name: 'PageInterest.find',
  validate: null,
  mixins: [CallPromiseMixin],
  run({ selector, options }) {
    PageInterests.assertAdminRoleForMethod(this.userId);
    const results = PageInterests.find(selector, options);
    return results.fetch();
  },
});
