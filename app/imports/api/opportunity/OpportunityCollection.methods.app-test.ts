import { Meteor } from 'meteor/meteor';
import { OpportunityDefine } from '../../typings/radgrad';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { Opportunities } from './OpportunityCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('OpportunityCollection Meteor Methods ', function test() {
    const collectionName = Opportunities.getCollectionName();
    const definitionData: OpportunityDefine = {
      name: 'name',
      slug: 'opportunity-slug-example',
      description: 'description',
      opportunityType: 'club',
      sponsor: 'radgrad@hawaii.edu',
      ice: { i: 5, c: 5, e: 5 },
      interests: ['algorithms'],
    };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student', 'opportunities'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      await defineMethod.callPromise({ collectionName, definitionData });
    });

    it('Update Method', async function () {
      const id = Opportunities.findIdBySlug(definitionData.slug);
      const description = 'updated description';
      await updateMethod.callPromise({ collectionName, updateData: { id, description } });
    });

    it('Remove Method', async function () {
      await removeItMethod.callPromise({ collectionName, instance: definitionData.slug });
    });
  });
}
