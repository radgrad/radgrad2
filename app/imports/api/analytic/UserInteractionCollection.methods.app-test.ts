import { Meteor } from 'meteor/meteor';
import { userInteractionDefineMethod, userInteractionRemoveUserMethod } from './UserInteractionCollection.methods';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser, sleep } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

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
      console.log('defineTestFixturesMethod');
    });

    it('Define Method', async function () {
      console.log('Define Method start');
      await withLoggedInUser();
      console.log('withLoggedInUser');
      await withRadGradSubscriptions();
      console.log(`Done with subscriptions ${new Date()}`);
      await sleep(50000);
      console.log(`Done with sleep ${new Date()}`);
      await userInteractionDefineMethod.callPromise(definitionData);
    });

    it('Remove Method', async function () {
      await userInteractionRemoveUserMethod.callPromise(student);
    });
  });
}
