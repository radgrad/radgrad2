import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { defineMethod, removeItMethod, updateMethod } from '../../base/BaseCollection.methods';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../../test/test-utilities';
import { ProfileCourses } from './ProfileCourseCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('ProfileCourseCollection', function testSuite() {
    const collectionName = ProfileCourses.getCollectionName();
    const definitionData = {
      course: 'ics_141',
      username: 'abi@hawaii.edu',
    };
    const updateData: any = { retired: true };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student'], done);
    });

    it('#define, #update, #removeIt Methods', async function test() {
      await withLoggedInUser();
      await withRadGradSubscriptions(Meteor.userId());
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(ProfileCourses.isDefined(docID), 'define: isDefined').to.be.true;
      expect(ProfileCourses.countNonRetired()).to.equal(1);
      updateData.id = docID;
      await updateMethod.callPromise({ collectionName, updateData });
      expect(ProfileCourses.countNonRetired()).to.equal(0);
      expect(ProfileCourses.isDefined(docID), 'retired: isDefined').to.be.true; // still in client collection
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(ProfileCourses.countNonRetired()).to.equal(0);
      expect(ProfileCourses.isDefined(docID), 'removeIt: isDefined').to.be.false;
    });
  });
}
