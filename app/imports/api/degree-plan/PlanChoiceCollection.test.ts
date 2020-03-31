import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { PlanChoiceCollection, PlanChoices } from './PlanChoiceCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('PlanChoiceCollection', function testSuite() {
    const simple = {
      choice: 'ics_111',
      label: 'ICS 111',
      courseSlugs: ['ics_111'],
    };
    const choice = {
      choice: 'ics_313,ics_361',
      label: 'ICS 313 or ICS 361',
      courseSlugs: ['ics_313', 'ics_361'],
    };
    const complex = {
      choice: 'ics_321,ics_332,(ics_415,ics_351)',
      label: 'ICS 321 or ICS_332 or (ICS 415 or ICS 351)',
      courseSlugs: ['ics_321', 'ics_332', 'ics_415', 'ics_351'],
    };
    const complex2 = {
      choice: '(ics_312,ics_331),(ics_313,ics_361),ics_355',
      label: '(ICS 312 or ICS 331) or (ICS 313 or ICS 361) or ICS 355',
      courseSlugs: ['ics_312', 'ics_331', 'ics_313', 'ics_361', 'ics_355'],
    };

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne, #checkIntegrity, #toStringFromSlug, #update', function test() {
      const docID = PlanChoices.define(simple);
      expect(PlanChoices.isDefined(docID)).to.be.true;
      const dumpObject = PlanChoices.dumpOne(docID);
      PlanChoices.removeIt(docID);
      expect(PlanChoices.isDefined(docID)).to.be.false;
      const planID = PlanChoices.restoreOne(dumpObject);
      expect(PlanChoices.isDefined(planID)).to.be.true;
      const choiceID = PlanChoices.define(choice);
      expect(PlanChoices.isDefined(choiceID)).to.be.true;
      const complexID = PlanChoices.define(complex);
      expect(PlanChoices.isDefined(complexID)).to.be.true;
      const errors = PlanChoices.checkIntegrity();
      expect(errors.length).to.equal(0);
      expect(PlanChoiceCollection.toStringFromSlug(simple.choice) === 'ICS 111').to.be.true;
      expect(PlanChoiceCollection.toStringFromSlug(choice.choice) === 'ICS 313 or ICS 361').to.be.true;
      expect(PlanChoiceCollection.toStringFromSlug(complex.choice) === 'ICS 321 or ICS 332 or (ICS 415 or ICS 351)').to.be.true;
      expect(PlanChoiceCollection.toStringFromSlug(complex2.choice) ===
          '(ICS 312 or ICS 331) or (ICS 313 or ICS 361) or ICS 355').to.be.true;
      let choices = PlanChoices.findNonRetired();
      expect(choices.length).to.equal(3);
      PlanChoices.update(complexID, { retired: true });
      choices = PlanChoices.findNonRetired();
      expect(choices.length).to.equal(2);
    });
  });
}
