import { Meteor } from 'meteor/meteor';
import {} from 'mocha';
import { userInteractionDefineMethod, userInteractionRemoveUserMethod } from './UserInteractionCollection.methods';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* tslint:disable:ter-prefer-arrow-callback no-unused-expression only-arrow-functions */

if (Meteor.isClient) {
  describe('UserInteractionCollection Meteor Methods ', function test() {
    const student = 'abi@hawaii.edu';
    const definitionData = {
      username: student,
      type: 'interaction-type',
      typeData: 'interaction-data',
    };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      await userInteractionDefineMethod.callPromise(definitionData);
    });

    it('Remove Method', async function () {
      await userInteractionRemoveUserMethod.callPromise(student);
    });
  });
}
