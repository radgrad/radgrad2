import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { Reviews } from './ReviewCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
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

    it('Define Method', async function (done) {
      try {
        await withLoggedInUser();
        await withRadGradSubscriptions();
        await defineMethod.callPromise({ collectionName, definitionData });
        done();
      } catch (e) {
        done(e);
      }
    });

    it('Update Method', async function (done) {
      try {
        const id = Reviews.findIdBySlug('review-course-ics_111-abi@hawaii.edu');
        const rating = 5;
        const comments = 'new comments';
        await updateMethod.callPromise({ collectionName, updateData: { id, rating, comments } });
        done();
      } catch (e) {
        done(e);
      }
    });

    it('Remove Method', async function (done) {
      try {
        const id = Reviews.findIdBySlug('review-course-ics_111-abi@hawaii.edu');
        await removeItMethod.callPromise({ collectionName, instance: id });
        done();
      } catch (e) {
        done(e);
      }
    });
  });
}
