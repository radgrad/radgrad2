import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { CareerGoals } from './CareerGoalCollection';
import { makeSampleInterest } from '../interest/SampleInterests';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('CareerGoalCollection', function testSuite() {
    const name = 'Graduate School';
    const slug = 'graduate-school';
    const description = 'Obtain a M.S. or Ph.D.';

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne, #getSlug, #findNames, #hasInterest, #update', function test() {
      const interests = [makeSampleInterest()];
      let docID = CareerGoals.define({ name, slug, description, interests });
      expect(CareerGoals.isDefined(slug)).to.be.true;
      expect(CareerGoals.getSlug(docID)).to.equal(slug);
      expect(CareerGoals.findNames([docID])[0]).to.equal(name);
      let errors = CareerGoals.checkIntegrity();
      expect(errors.length).to.equal(0);
      const dumpObject = CareerGoals.dumpOne(docID);
      CareerGoals.removeIt(slug);
      expect(CareerGoals.isDefined(slug)).to.be.false;
      docID = CareerGoals.restoreOne(dumpObject);
      expect(CareerGoals.isDefined(slug)).to.be.true;
      expect(CareerGoals.hasInterest(docID, interests[0])).to.be.true;
      expect(CareerGoals.countNonRetired()).to.equal(1);
      errors = CareerGoals.checkIntegrity();
      expect(errors.length).to.equal(0);
      CareerGoals.update(docID, { retired: true });
      expect(CareerGoals.countNonRetired()).to.equal(0);
    });
  });
}
