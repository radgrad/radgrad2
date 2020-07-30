import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';
import { FavoriteAcademicPlans } from './FavoriteAcademicPlanCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('FavoriteAcademicPlanCollection', function testSuite() {
    const collectionName = FavoriteAcademicPlans.getCollectionName();
    const student = 'abi@hawaii.edu';
    const definitionData = {
      academicPlan: 'bs-cs-2016',
      student,
    };
    const updateData: any = { retired: true };

    before(function (done) {
      this.timeout(50000);
      defineTestFixturesMethod.call(['minimal', 'abi.student'], done);
    });

    it('#define, #update, #removeIt Methods', async function test() {
      await withLoggedInUser();
      await withRadGradSubscriptions(Meteor.userId());
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(FavoriteAcademicPlans.isDefined(docID), `define: ${docID} isDefined`).to.be.true;
      expect(FavoriteAcademicPlans.countNonRetired()).to.equal(1);
      updateData.id = docID;
      await updateMethod.callPromise({ collectionName, updateData });
      expect(FavoriteAcademicPlans.countNonRetired()).to.equal(0);
      expect(FavoriteAcademicPlans.isDefined(docID), 'retired: isDefined').to.be.true; // still in client collection
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(FavoriteAcademicPlans.countNonRetired()).to.equal(0);
      expect(FavoriteAcademicPlans.isDefined(docID), 'removeIt: isDefined').to.be.false;
    });
  });
}
