import { Meteor } from 'meteor/meteor';
import { defineTestFixturesMethod } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('Feedback Functions Meteor Methods ', function test() {
    // const collectionName = FeedbackInstances.getCollectionName();

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student',
        'extended.courses.interests', 'abi.courseinstances'], done);
    });
  });
}
