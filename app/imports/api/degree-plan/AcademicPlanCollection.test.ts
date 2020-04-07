import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import moment from 'moment';
import faker from 'faker';
import fc from 'fast-check';
import 'mocha';
import { DesiredDegrees } from './DesiredDegreeCollection';
import { AcademicPlans } from './AcademicPlanCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { makeSampleAcademicPlan } from './SampleAcademicPlans';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('AcademicPlanCollection', function testSuite() {
    const name = 'Bachelors in Computer Science';
    const shortName = 'B.S. CS';
    const degreeSlug = 'bs-cs';
    const description = 'B.S. in CS.';
    const academicTerm = 'Spring-2017';
    const slug = 'bs-cs-2017';
    const notDefinedAcademicTerm = 'Spring-2009';
    const coursesPerAcademicTerm = [2, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0];
    const choiceList = [
      'ics_111-1',
      'ics_141-1',
      'ics_211-1',
      'ics_241-1',
      'ics_311-1',
      'ics_314-1',
      'ics_212-1',
      'ics_321-1',
      'ics_312,ics_331-1',
      'ics_313,ics_361-1',
      'ics_332-1',
      'ics_400+-1',
      'ics_400+-2',
      'ics_400+-3',
      'ics_400+-4',
      'ics_400+-5',
    ];
    const badCourseList = [
      'ics_111-1',
      'ics_141-1',
      'ics_211-1',
      'ics_241-1',
      'ics_311-1',
      'ics_314-1',
      'ics_212-1',
      'ics_321-1',
      'ics_312,ics_331-1',
      'ics_313,ics_361-1',
      'ics_332-1',
      'ics_400+-1',
      'ics_400+-2',
      'ics_400+-3',
      'ics_400+-4',
    ];

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(15000);
      fc.assert(
        fc.property(fc.integer(1, 3), fc.integer(2018, 2025), fc.lorem(1), fc.lorem(5), fc.lorem(), fc.lorem(5), fc.lorem(12), (termNameInt, termYear, fcDegreeSlug, fcDegreeName, fcPlanSlug, fcName, fcDescription) => {
          const dSlug = `degree-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`;
          const pSlug = `plan-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`;
          let term;
          switch (termNameInt) {
            case 1:
              term = AcademicTerms.FALL;
              break;
            case 2:
              term = AcademicTerms.SPRING;
              break;
            default:
              term = AcademicTerms.SUMMER;
          }
          const academicTermSlug = `${term}-${termYear}`;
          const termID = AcademicTerms.define({ term, year: termYear });
          const degreeID = DesiredDegrees.define({
            name: fcDegreeName,
            shortName: fcName,
            slug: dSlug,
            description: fcDescription,
          });
          const docID = AcademicPlans.define({
            slug: pSlug,
            name: fcName,
            description: fcDescription,
            degreeSlug: dSlug,
            academicTerm: academicTermSlug,
            choiceList,
            coursesPerAcademicTerm,
          });
          expect(AcademicPlans.isDefined(docID)).to.be.true;
          AcademicPlans.removeIt(docID);
          expect(AcademicPlans.isDefined(docID)).to.be.false;
          AcademicTerms.removeIt(termID);
          DesiredDegrees.removeIt(degreeID);
        }),
      );
      done();
    });

    it('Can define duplicates', function test2(done) {
      const termID = AcademicTerms.define({ term: 'Spring', year: 2017 });
      const degreeID = DesiredDegrees.define({ name, shortName, slug: degreeSlug, description });
      const docID1 = AcademicPlans.define({
        slug,
        degreeSlug,
        name: description,
        description,
        academicTerm,
        coursesPerAcademicTerm,
        choiceList,
      });
      const docID2 = AcademicPlans.define({
        slug,
        degreeSlug,
        name: description,
        description,
        academicTerm,
        coursesPerAcademicTerm,
        choiceList,
      });
      expect(docID1).to.equal(docID2);
      expect(AcademicPlans.isDefined(docID1)).to.be.true;
      // clean up
      AcademicPlans.removeIt(docID2);
      AcademicTerms.removeIt(termID);
      DesiredDegrees.removeIt(degreeID);
    });

    it('Can update', function test3(done) {
      this.timeout(5000);
      const docID = makeSampleAcademicPlan();

      done();
    });

    it('Can update', function test2() {
      // Arrange
      const docID = AcademicPlans.findIdBySlug(slug);
      // Act
      AcademicPlans.update(docID, { retired: true });
      // Assert
      expect(AcademicPlans.countNonRetired()).to.equal(0);
    });

    it('Can dump removeIt and restore', function test3() {
      // Arrange
      const docID = AcademicPlans.findIdBySlug(slug);
      // Act
      const dumpObject = AcademicPlans.dumpOne(docID);
      AcademicPlans.removeIt(docID);
      expect(AcademicPlans.isDefined(docID)).to.be.false;
      const planID = AcademicPlans.restoreOne(dumpObject);
      // Assert
      expect(AcademicPlans.isDefined(planID)).to.be.true;
    });

    it('Can checkIntegrity no errors', function test4() {
      // Act
      const errors = AcademicPlans.checkIntegrity();
      // console.log(errors);
      // Assert
      expect(errors.length).to.equal(0);
    });

    it('Can get plans for degree, good slug', function test6() {
      const plans = AcademicPlans.getPlansForDegree(degreeSlug);
      expect(plans).to.have.lengthOf(1);
    });

    it('Can get latest plans', function test8() {
      const plans = AcademicPlans.getLatestPlans();
      expect(plans).to.have.lengthOf(1);
    });

    it('Can get latest academic term number', function test9() {
      const termNumber = AcademicPlans.getLatestAcademicTermNumber();
      expect(termNumber).to.equal(19); // TODO: This needs to be updated each academic term.
    });

    it('Can checkIntegrity errors', function test10() {
      // Arrange
      const docID = AcademicPlans.findIdBySlug(slug);
      AcademicPlans.removeIt(docID);
      const badID = AcademicPlans.define({
        slug, degreeSlug, name: description, description, academicTerm: notDefinedAcademicTerm, coursesPerAcademicTerm,
        choiceList: badCourseList,
      });
      expect(AcademicPlans.isDefined(badID)).to.be.true;
      const errors = AcademicPlans.checkIntegrity();
      // console.log(errors);
      expect(errors).to.have.lengthOf(1);
    });
  });
}
