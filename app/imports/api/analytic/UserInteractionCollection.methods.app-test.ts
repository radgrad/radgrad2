import { Meteor } from 'meteor/meteor';
import {} from 'mocha';
import { userInteractionDefineMethod, userInteractionRemoveUserMethod } from './UserInteractionCollection.methods';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
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
    });

    it('Define Method', async function (done) {
      try {
        await withLoggedInUser();
        await withRadGradSubscriptions();
        await userInteractionDefineMethod.callPromise(definitionData);
        done();
      } catch (e) {
        done(e);
      }
    });

    it('Remove Method', async function (done) {
      try {
        await userInteractionRemoveUserMethod.callPromise(student);
        done();
      } catch (e) {
        done(e);
      }
    });
  });
}
