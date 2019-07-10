import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { DesiredDegrees } from './DesiredDegreeCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('DesiredDegreeCollection Meteor Methods ', function test() {
    const collectionName = DesiredDegrees.getCollectionName();
    const definitionData = {
      name: 'B.A. in Information and Computer Sciences Test',
      shortName: 'B.A. ICS Test',
      slug: 'ba-ics-test',
      description: 'The Bachelor of Arts (BA) degree allows you to combine computer science with another discipline.',
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
        const id = DesiredDegrees.findIdBySlug(definitionData.slug);
        const name = 'updated DesiredDegree name';
        const shortName = 'updated short name';
        const description = 'updated description';
        await updateMethod.callPromise({ collectionName, updateData: { id, name, shortName, description } });
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
