import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import { PlanChoices } from './PlanChoiceCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { makeComplexPlanChoice, makeSimplePlanChoice, makeSinglePlanChoice } from './SamplePlanChoices';
import { getDepartment } from './PlanChoiceUtilities';
import { PlanChoiceType } from './PlanChoiceType';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('PlanChoiceCollection', function testSuite() {
    const single = 'ics_111';
    const simple = 'ics_313,ics_361';
    const complex = 'ics_321,ics_332,(ics_415,ics_351)';
    const complex2 = '(ics_312,ics_331),(ics_313,ics_361),ics_355';
    const xPlus = 'ics_257+';

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(50000);
      fc.assert(
        fc.property(fc.lorem(2), fc.boolean(), (fake, retired) => {
          let choice = makeSinglePlanChoice({});
          let docID = PlanChoices.define({ choice, retired });
          expect(PlanChoices.isDefined(docID)).to.be.true;
          PlanChoices.removeIt(docID);
          expect(PlanChoices.isDefined(docID)).to.be.false;
          choice = makeSimplePlanChoice({});
          docID = PlanChoices.define({ choice, retired });
          expect(PlanChoices.isDefined(docID)).to.be.true;
          PlanChoices.removeIt(docID);
          expect(PlanChoices.isDefined(docID)).to.be.false;
          choice = makeComplexPlanChoice({});
          // console.log(PlanChoices.toString(choice));
          docID = PlanChoices.define({ choice, retired });
          expect(PlanChoices.isDefined(docID)).to.be.true;
          PlanChoices.removeIt(docID);
          expect(PlanChoices.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Can define duplicates', function test2(done) {
      const choice = makeComplexPlanChoice({});
      const docID1 = PlanChoices.define({ choice });
      const docID2 = PlanChoices.define({ choice });
      expect(docID1).to.equal(docID2);
      expect(PlanChoices.isDefined(docID2)).to.be.true;
      PlanChoices.removeIt(docID1);
      expect(PlanChoices.isDefined(docID2)).to.be.false;
      done();
    });

    it('Can update', function test3(done) {
      this.timeout(50000);
      let choice = makeSinglePlanChoice({});
      const dept = getDepartment(choice);
      const docID = PlanChoices.define({ choice });
      fc.assert(
        fc.property(fc.lorem(2), fc.boolean(), (fake, retired) => {
          choice = makeSimplePlanChoice({ dept });
          PlanChoices.update(docID, { choice, retired });
          const doc = PlanChoices.findDoc(docID);
          expect(doc.choice).to.equal(choice);
          expect(doc.retired).to.equal(retired);
        }),
      );
      PlanChoices.removeIt(docID);
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test5() {
      const choice = makeComplexPlanChoice({});
      let docID = PlanChoices.define({ choice });
      const origDoc = PlanChoices.findDoc(docID);
      expect(PlanChoices.isDefined(docID)).to.be.true;
      const dumpObject = PlanChoices.dumpOne(docID);
      expect(dumpObject.choice).to.equal(choice);
      expect(dumpObject.retired).to.be.false;
      PlanChoices.removeIt(docID);
      expect(PlanChoices.isDefined(docID)).to.be.false;
      docID = PlanChoices.restoreOne(dumpObject);
      const restored = PlanChoices.findDoc(docID);
      expect(origDoc.choice).to.equal(restored.choice);
      expect(origDoc.retired).to.equal(restored.retired);
    });

    it('Can checkIntegrity with errors', function test6() {
      const errors = PlanChoices.checkIntegrity();
      expect(errors.length).to.equal(4); // there are 4 choices defined in the complex choice w/o Courses.
    });

    it('Can get toString', function test7() {
      expect(PlanChoices.toString(single)).to.equal('ICS 111');
      expect(PlanChoices.toString(simple)).to.equal('ICS 313 or ICS 361');
      expect(PlanChoices.toString(complex)).to.equal('ICS 321 or ICS 332 or (ICS 415 or ICS 351)');
      expect(PlanChoices.toString(complex2)).to.equal('(ICS 312 or ICS 331) or (ICS 313 or ICS 361) or ICS 355');
    });

    it('Can get choice type', function test8() {
      expect(PlanChoices.getPlanChoiceType(single)).to.equal(PlanChoiceType.SINGLE);
      expect(PlanChoices.getPlanChoiceType(simple)).to.equal(PlanChoiceType.SIMPLE);
      expect(PlanChoices.getPlanChoiceType(complex)).to.equal(PlanChoiceType.COMPLEX);
      expect(PlanChoices.getPlanChoiceType(complex2)).to.equal(PlanChoiceType.COMPLEX);
      expect(PlanChoices.getPlanChoiceType(xPlus)).to.equal(PlanChoiceType.XPLUS);
    });

    it('Can check if course slug satisfies choice', function test9() {
      expect(PlanChoices.satisfiesPlanChoice(single, 'ics_111')).to.be.true;
      expect(PlanChoices.satisfiesPlanChoice(single, 'ics_211')).to.be.false;
      expect(PlanChoices.satisfiesPlanChoice(simple, 'ics_313')).to.be.true;
      expect(PlanChoices.satisfiesPlanChoice(simple, 'ics_361')).to.be.true;
      expect(PlanChoices.satisfiesPlanChoice(simple, 'ics_314')).to.be.false;
      expect(PlanChoices.satisfiesPlanChoice(complex, 'ics_321')).to.be.true;
      expect(PlanChoices.satisfiesPlanChoice(complex, 'ics_332')).to.be.true;
      expect(PlanChoices.satisfiesPlanChoice(complex, 'ics_415')).to.be.true;
      expect(PlanChoices.satisfiesPlanChoice(complex, 'ics_351')).to.be.true;
      expect(PlanChoices.satisfiesPlanChoice(complex, 'ics_355')).to.be.false;
      expect(PlanChoices.satisfiesPlanChoice(complex2, 'ics_312')).to.be.true;
      expect(PlanChoices.satisfiesPlanChoice(complex2, 'ics_331')).to.be.true;
      expect(PlanChoices.satisfiesPlanChoice(complex2, 'ics_313')).to.be.true;
      expect(PlanChoices.satisfiesPlanChoice(complex2, 'ics_361')).to.be.true;
      expect(PlanChoices.satisfiesPlanChoice(complex2, 'ics_355')).to.be.true;
      expect(PlanChoices.satisfiesPlanChoice(complex2, 'ics_455')).to.be.false;
      expect(PlanChoices.satisfiesPlanChoice(xPlus, 'ics_455')).to.be.true;
      expect(PlanChoices.satisfiesPlanChoice(xPlus, 'ics_255')).to.be.false;
    });
  });
}
