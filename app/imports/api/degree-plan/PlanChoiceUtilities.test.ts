import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import * as planChoiceUtilities from './PlanChoiceUtilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('PlanChoiceUtilities', function testSuite() {
    it('#stripCounter', function test() {
      let slug = 'ics_111';
      expect(planChoiceUtilities.stripCounter(slug)).to.equal('ics_111');
      slug = 'ics_400+-5';
      expect(planChoiceUtilities.stripCounter(slug)).to.equal('ics_400+');
    });
    it('#is*Choice', function test() {
      let slug = 'ics_111';
      expect(planChoiceUtilities.isSingleChoice(slug)).to.be.true;
      expect(planChoiceUtilities.isSimpleChoice(slug)).to.be.false;
      expect(planChoiceUtilities.isComplexChoice(slug)).to.be.false;
      slug = 'ics_111,ics_211';
      expect(planChoiceUtilities.isSingleChoice(slug)).to.be.false;
      expect(planChoiceUtilities.isSimpleChoice(slug)).to.be.true;
      expect(planChoiceUtilities.isComplexChoice(slug)).to.be.false;
      slug = 'ics_111,(ics_211,ics_355)';
      expect(planChoiceUtilities.isSingleChoice(slug)).to.be.false;
      expect(planChoiceUtilities.isSimpleChoice(slug)).to.be.false;
      expect(planChoiceUtilities.isComplexChoice(slug)).to.be.true;
    });
    it('#complexChoiceToArray', function test() {
      let slug = 'ics_111,(ics_211,ics_355)';
      let ans = planChoiceUtilities.complexChoiceToArray(slug);
      expect(ans.length).to.equal(3);
      expect(ans[1]).to.equal('ics_211');
      slug = 'ics_111';
      ans = planChoiceUtilities.complexChoiceToArray(slug);
      expect(ans.length).to.equal(1);
      expect(ans[0]).to.equal('ics_111');
    });
    it('#buildCourseSlugName', function test() {
      let slug = 'ics_111';
      expect(planChoiceUtilities.buildCourseSlugName(slug)).to.equal('ICS 111');
      slug = 'ee_111';
      expect(planChoiceUtilities.buildCourseSlugName(slug)).to.equal('EE 111');
    });
    it('#satisfiesPlanChoice', function test() {
      let planChoice = 'ics_111';
      let slug = 'ics_111';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.true;
      slug = 'ee_111';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.false;
      slug = 'ics_141';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.false;
      planChoice = 'ics_313,ics_331';
      slug = 'ics_313';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.true;
      slug = 'ics_331';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.true;
      slug = 'ics_355';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.false;
      slug = 'ee_331';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.false;
      planChoice = 'ics_311,ee_331';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.true;
      slug = 'ics_311';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.true;
      slug = 'ics_331';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.false;
      planChoice = '(ics_313,ics_331),ics_355';
      slug = 'ics_313';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.true;
      slug = 'ics_331';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.true;
      slug = 'ics_355';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.true;
      planChoice = '(ics_313,ics_331),(ics_312,ics_332)';
      slug = 'ics_355';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.false;
    });
    it('#getDepartment, #getDepartments', function test() {
      let slug = 'ics_111';
      expect(planChoiceUtilities.getDepartment(slug)).to.equal('ics');
      slug = 'ee_111';
      expect(planChoiceUtilities.getDepartment(slug)).to.equal('ee');
      slug = '(ics_111,ics_141),ee_160';
      const departments = planChoiceUtilities.getDepartments(slug);
      expect(departments.length).to.equal(2);
      expect(departments.indexOf('ics')).to.equal(0);
      expect(departments.indexOf('ee')).to.equal(1);
    });
    it('#compoundCombineChoices', function () {
      const choice1 = 'ics_111';
      const choice2 = 'ics_211';
      const choice3 = 'ics_141';
      const choice4 = 'ics_241';
      const result1 = planChoiceUtilities.compoundCombineChoices(choice1, choice2);
      expect(result1).to.equal(`${choice1},${choice2}`);
      const result2 = planChoiceUtilities.compoundCombineChoices(result1, choice3);
      expect(result2).to.equal(`(${result1}),${choice3}`);
      const result3 = planChoiceUtilities.compoundCombineChoices(choice4, result2);
      expect(result3).to.equal(`${choice4},(${result2})`);
      console.log(result1, result2, result3);
    });
  });
}
