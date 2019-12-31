import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import 'mocha';
import { DesiredDegrees } from './DesiredDegreeCollection';
import { AcademicPlans } from './AcademicPlanCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { removeAllEntities } from '../base/BaseUtilities';

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
    const courseList = [
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
      this.timeout(5000);
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define', function test1() {
      // Arrange
      AcademicTerms.define({ term: 'Spring', year: 2017 });
      DesiredDegrees.define({ name, shortName, slug: degreeSlug, description });
      // Act
      const docID = AcademicPlans.define({
        slug,
        degreeSlug,
        name: description,
        description,
        academicTerm,
        coursesPerAcademicTerm,
        courseList,
      });
      // Assert
      expect(AcademicPlans.isDefined(docID)).to.be.true;
      expect(AcademicPlans.findIdBySlug(slug)).to.be.a('string');
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
      expect(termNumber).to.equal(19);
    });

    it('Can checkIntegrity one error', function test5() {
      // Arrange
      const docID = AcademicPlans.findIdBySlug(slug);
      AcademicPlans.removeIt(docID);
        const badID = AcademicPlans.define({
          slug, degreeSlug, name: description, description, academicTerm: notDefinedAcademicTerm, coursesPerAcademicTerm,
          courseList: badCourseList,
        });
        expect(AcademicPlans.isDefined(badID)).to.be.true;
        const errors = AcademicPlans.checkIntegrity();
        expect(errors).to.have.lengthOf(1);
    });
  });
}
