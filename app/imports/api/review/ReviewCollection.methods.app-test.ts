import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { Reviews } from './ReviewCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('ReviewCollection Meteor Methods ', function test() {
    const collectionName = Reviews.getCollectionName();
    // Note that we allow the slug to be defined by default.
    const definitionData = {
      student: 'abi@hawaii.edu',
      reviewType: 'course',
      reviewee: 'ics_111',
      academicTerm: 'Fall-2016',
      rating: 3,
      comments: 'This is great!',
    };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      await defineMethod.callPromise({ collectionName, definitionData });
    });

    it('Update Method', async function () {
      const id = Reviews.findOne({});
      const rating = 5;
      const comments = 'new comments';
      await updateMethod.callPromise({ collectionName, updateData: { id, rating, comments } });
    });

    it('Remove Method', async function () {
      const id = Reviews.findOne({});
      await removeItMethod.callPromise({ collectionName, instance: id });
    });
  });
}
