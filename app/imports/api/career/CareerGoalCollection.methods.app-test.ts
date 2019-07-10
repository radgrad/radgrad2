import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { CareerGoals } from './CareerGoalCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */


if (Meteor.isClient) {
  describe('CareerGoalCollection Meteor Methods ', function test() {
    const collectionName = CareerGoals.getCollectionName();
    const definitionData = {
      name: 'name',
      slug: 'career-goal-slug-example',
      description: 'description',
      interests: ['algorithms'],
    };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student'], done);
    });

    it('Define Method', async function (done) {
      try {
        await withLoggedInUser();
        await withRadGradSubscriptions();
        const careerGoalID = await defineMethod.callPromise({ collectionName, definitionData });
        expect(CareerGoals.isDefined(careerGoalID)).to.be.true;
        done();
      } catch (e) {
        done(e);
      }
    });

    it('Update Method', async function (done) {
      try {
        const id = CareerGoals.findIdBySlug(definitionData.slug);
        const name = 'updated CareerGoal name';
        const description = 'updated CareerGoal description';
        const interests = ['algorithms', 'java'];
        await updateMethod.callPromise({ collectionName, updateData: { id, name, description, interests } });
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
