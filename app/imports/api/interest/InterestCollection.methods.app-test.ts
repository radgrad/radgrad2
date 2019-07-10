import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { Interests } from './InterestCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('InterestCollection Meteor Methods ', function test() {
    const collectionName = Interests.getCollectionName();
    const definitionData = {
      name: 'name',
      slug: 'interest-slug-example',
      interestType: 'cs-disciplines',
      description: 'description',
    };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal'], done);
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
        const id = Interests.findIdBySlug(definitionData.slug);
        const name = 'updated interest name';
        const description = 'updated description';
        await updateMethod.callPromise({ collectionName, updateData: { id, name, description } });
        done();
      } catch (e) {
        done(e);
      }
    });

    it('Remove Method', async function (done) {
      try {
        await removeItMethod.callPromise({ collectionName, instance: definitionData.slug });
        done();
      } catch (e) {
        done(e);
      }
    });
  });
}
