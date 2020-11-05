import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import moment from 'moment';
import fc from 'fast-check';
import 'mocha';
import { DesiredDegrees } from './DesiredDegreeCollection';
import { AcademicPlans } from './AcademicPlanCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { makeSampleAcademicPlan, makeSampleChoiceList, makeSampleCoursesPerTerm } from './SampleAcademicPlans';
import { makeSampleAcademicTerm } from '../academic-term/SampleAcademicTerms';
import { IAcademicPlan } from '../../typings/radgrad';

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

    it('Can define duplicates', function test2() {
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
      const docID = makeSampleAcademicPlan();
      // { degreeSlug, name, academicTerm, coursesPerAcademicTerm, choiceList, retired }
      fc.assert(
        fc.property(fc.lorem(), fc.boolean(), (fcName, fcRetired) => {
          const coursesPerAcademicTerm2 = makeSampleCoursesPerTerm();
          const choiceList2 = makeSampleChoiceList(coursesPerAcademicTerm);
          const academicTerm2 = makeSampleAcademicTerm();
          AcademicPlans.update(docID, {
            name: fcName,
            academicTerm: academicTerm2,
            coursesPerAcademicTerm: coursesPerAcademicTerm2,
            choiceList: choiceList2,
            retired: fcRetired,
          });
          const doc = AcademicPlans.findDoc(docID);
          // console.log(doc, coursePerAcademicTerm);
          expect(doc.name).to.equal(fcName);
          expect(doc.coursesPerAcademicTerm).to.have.ordered.members(coursesPerAcademicTerm2);
        }),
      );
      AcademicPlans.removeIt(docID);
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let docID = makeSampleAcademicPlan();
      expect(AcademicPlans.isDefined(docID)).to.be.true;
      const origPlan: IAcademicPlan = AcademicPlans.findDoc(docID);
      const dumpObject = AcademicPlans.dumpOne(docID);
      AcademicPlans.removeIt(docID);
      expect(AcademicPlans.isDefined(docID)).to.be.false;
      docID = AcademicPlans.restoreOne(dumpObject);
      const doc: IAcademicPlan = AcademicPlans.findDoc(docID);
      expect(origPlan.name).to.equal(doc.name);
      expect(origPlan.degreeID).to.equal(doc.degreeID);
      expect(origPlan.description).to.equal(doc.description);
      expect(origPlan.academicTermNumber).to.equal(doc.academicTermNumber);
      expect(origPlan.coursesPerAcademicTerm).to.have.ordered.members(doc.coursesPerAcademicTerm);
      expect(origPlan.choiceList).to.have.ordered.members(doc.choiceList);
    });

    it('Can checkIntegrity no errors', function test5() {
      // Act
      const errors = AcademicPlans.checkIntegrity();
      // console.log(errors);
      // Assert
      expect(errors.length).to.equal(0);
    });

    it('Can get latest plans', function test6() {
      const plans = AcademicPlans.getLatestPlans();
      expect(plans).to.have.lengthOf(1);
    });

    it('Can checkIntegrity errors', function test7() {
      // Arrange
      const doc = AcademicPlans.findOne({});
      const docID = doc._id;
      AcademicPlans.update(docID, { choiceList: badCourseList });
      const errors = AcademicPlans.checkIntegrity();
      // console.log(errors);
      expect(errors).to.have.lengthOf(1);
    });
  });
}
