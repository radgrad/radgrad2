import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { OpportunityInstances } from './OpportunityInstanceCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('OpportunityInstanceCollection Meteor Methods ', function test() {
    const collectionName = OpportunityInstances.getCollectionName();
    const academicTerm = 'Spring-2017';
    const student = 'abi@hawaii.edu';
    const opportunity = 'acm-manoa';
    const verified = true;
    const definitionData = { academicTerm, opportunity, student, verified };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student', 'opportunities'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      await defineMethod.callPromise({ collectionName, definitionData });
    });

    it('Update Method', async function () {
      const id = OpportunityInstances.findOpportunityInstanceDoc(academicTerm, opportunity, student)._id;
      await updateMethod.callPromise({ collectionName, updateData: { id, verified: false } });
    });

    it('Remove Method', async function () {
      const instance = OpportunityInstances.findOpportunityInstanceDoc(academicTerm, opportunity, student)._id;
      await removeItMethod.callPromise({ collectionName, instance });
    });
  });
}
