import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { expect } from 'chai';
import { IAcademicPlan } from '../../typings/radgrad'; // eslint-disable-line
import * as AcademicPlanUtilities from './AcademicPlanUtilities';
import { RadGradSettings } from '../radgrad/RadGradSettingsCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('AcademicPlanUtilities', function testSuite() {
    const _id = Random.id();
    const name = 'good';
    const description = 'description';
    const courseList = [];
    const coursesPerAcademicTerm = [];
    const shortList = [];
    const shortCourses = [];
    const year = 2019;
    let goodPlan;
    let badPlan;
    before(function setup() {
      const quarters = RadGradSettings.findOne({}).quarterSystem;
      if (quarters) {
        courseList.push('ics_111-1');
        courseList.push('ics_141-1');
        courseList.push('ics_211-1');
        courseList.push('ics_241-1');
        coursesPerAcademicTerm.push(1);
        coursesPerAcademicTerm.push(1);
        coursesPerAcademicTerm.push(1);
        coursesPerAcademicTerm.push(1);
        shortList.push('ics_111-1');
        shortList.push('ics_211-1');
        shortList.push('ics_311-1');
        shortCourses.push(2);
        shortCourses.push(2);
        shortCourses.push(0);
      } else {
        courseList.push('ics_111-1');
        courseList.push('ics_141-1');
        courseList.push('ics_211-1');
        courseList.push('ics_241-1');
        coursesPerAcademicTerm.push(2);
        coursesPerAcademicTerm.push(2);
        coursesPerAcademicTerm.push(0);
        shortList.push('ics_111-1');
        shortList.push('ics_211-1');
        shortList.push('ics_311-1');
        shortCourses.push(1);
        shortCourses.push(2);
      }
      goodPlan = {
        _id,
        name,
        description,
        degreeID: Random.id(),
        slugID: Random.id(),
        courseList,
        coursesPerAcademicTerm,
        effectiveAcademicTermID: Random.id(),
        year,
        academicTermNumber: 3,
      };
      badPlan = {
        _id,
        name,
        description,
        degreeID: Random.id(),
        slugID: Random.id(),
        courseList: shortList,
        coursesPerAcademicTerm: shortCourses,
        effectiveAcademicTermID: Random.id(),
        year,
        academicTermNumber: 3,
      };
    });

    it('getPlanChoicesRaw', function () {
      const quarters = RadGradSettings.findOne({}).quarterSystem;
      const courses = AcademicPlanUtilities.getPlanChoicesRaw(goodPlan.coursesPerAcademicTerm, goodPlan.courseList, 1);
      if (quarters) {
        expect(courses.length).to.equal(1);
        expect(courses[0]).to.equal('ics_141-1');
      } else {
        expect(courses.length).to.equal(2);
        expect(courses[0]).to.equal('ics_211-1');
      }
    });

    it('isAcademicPlanValid', function () {
      expect(AcademicPlanUtilities.isAcademicPlanValid(goodPlan)).to.be.true;
      expect(AcademicPlanUtilities.isAcademicPlanValid(badPlan)).to.be.false;
    });
    it('addChoiceToPlan', function () {
      // console.log('before %o', badPlan);
      AcademicPlanUtilities.addChoiceToPlan(badPlan, 2, 'ics_314');
      // console.log('after %o', badPlan);
      expect(AcademicPlanUtilities.isAcademicPlanValid(badPlan)).to.be.true;
      AcademicPlanUtilities.addChoiceToPlan(goodPlan, 1, 'ics_314');
      expect(AcademicPlanUtilities.isAcademicPlanValid(goodPlan)).to.be.true;
      // console.log('updated good %o', goodPlan);
    });
    it('addDuplicateChoice', function () {
      AcademicPlanUtilities.addChoiceToPlan(badPlan, 0, 'ics_314');
      // console.log('after duplicate %o', badPlan);
      expect(AcademicPlanUtilities.isAcademicPlanValid(badPlan)).to.be.true;
    });
  });
}
