import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { defineMethod, removeItMethod, updateMethod } from '../../base/BaseCollection.methods';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../../test/test-utilities';
import { ProfileOpportunities } from './ProfileOpportunityCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('ProfileOpportunityCollection', function testSuite() {
    const collectionName = ProfileOpportunities.getCollectionName();
    const definitionData = {
      opportunity: 'acm-icpc',
      username: 'abi@hawaii.edu',
    };
    const updateData: any = { retired: true };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student', 'opportunities'], done);
    });

    it('#define, #update, #removeIt Methods', async function test() {
      await withLoggedInUser();
      await withRadGradSubscriptions(Meteor.userId());
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(ProfileOpportunities.isDefined(docID), 'define: isDefined').to.be.true;
      expect(ProfileOpportunities.countNonRetired()).to.equal(1);
      updateData.id = docID;
      await updateMethod.callPromise({ collectionName, updateData });
      expect(ProfileOpportunities.countNonRetired()).to.equal(0);
      expect(ProfileOpportunities.isDefined(docID), 'retired: isDefined').to.be.true; // still in client collection
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(ProfileOpportunities.countNonRetired()).to.equal(0);
      expect(ProfileOpportunities.isDefined(docID), 'removeIt: isDefined').to.be.false;
    });
  });
}
