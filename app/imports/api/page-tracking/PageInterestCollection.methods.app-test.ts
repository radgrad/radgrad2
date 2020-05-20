import { Meteor } from 'meteor/meteor';
import { defineTestFixturesMethod, withLoggedInUser, withRadGradSubscriptions } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('PageInterestCollection Meteor Methods ', function test() {
    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
    });

    it('Remove Method', async function () {

    });
  });
}
