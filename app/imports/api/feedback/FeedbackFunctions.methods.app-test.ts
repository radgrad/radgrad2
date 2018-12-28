import { Meteor } from 'meteor/meteor';
import { defineTestFixturesMethod } from '../test/test-utilities';

/* tslint:disable:ter-prefer-arrow-callback no-unused-expression only-arrow-functions */

if (Meteor.isClient) {
  describe('Feedback Functions Meteor Methods ', function test() {
    // const collectionName = FeedbackInstances.getCollectionName();

    before(function(done) {
      this.timeout(5000);
      defineTestFixturesMethod.call(['minimal', 'abi.student',
        'extended.courses.interests', 'academicplan', 'abi.courseinstances'], done);
    });
  });
}
