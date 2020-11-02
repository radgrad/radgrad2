import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { Courses } from '../course/CourseCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import * as ICE from './IceProcessor';
import { removeAllEntities } from '../base/BaseUtilities';
import { defineTestFixtures } from '../test/test-utilities';
import { Ice } from '../../typings/radgrad';
import { makeSampleIce } from './SampleIce';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('IceProcessor', function testSuite() {
    it('Can check isICE and assertICE', function test1() {
      const ice: Ice = makeSampleIce();
      const notIce: { i: number; d: number; e: number; } = { i: 0, d: 10, e: 15 };
      ICE.assertICE(ice);
      expect(ICE.isICE(ice)).to.be.true;
      expect(ICE.isICE(undefined)).to.be.false;
      expect(() => ICE.assertICE(ice)).to.not.throw(Error);
      expect(() => ICE.assertICE(notIce)).to.throw(Error);
    });

    it('Can makeCourseICE', function test2() {
      expect(ICE.makeCourseICE('ics_111', 'A').c).to.equal(ICE.gradeCompetency.A);
      expect(ICE.makeCourseICE('ics_112', 'A+').c).to.equal(ICE.gradeCompetency.A);
      expect(ICE.makeCourseICE('ics_113', 'A-').c).to.equal(ICE.gradeCompetency.A);
      expect(ICE.makeCourseICE('ics_113', 'A*').c).to.equal(ICE.gradeCompetency.C);
      expect(ICE.makeCourseICE('ics_111', 'B+').c).to.equal(ICE.gradeCompetency.B);
      expect(ICE.makeCourseICE('ics_111', 'B').c).to.equal(ICE.gradeCompetency.B);
      expect(ICE.makeCourseICE('ics_111', 'B-').c).to.equal(ICE.gradeCompetency.B);
      expect(ICE.makeCourseICE(Courses.unInterestingSlug, 'A').c).to.equal(ICE.gradeCompetency.C);
    });

    it('Can getEarnedICE and getProjectedICE', function test3(done) {
      defineTestFixtures(['minimal', 'extended.courses.interests', 'abi.student', 'abi.courseinstances']);
      const cis = CourseInstances.find().fetch();
      const earnedICE = ICE.getEarnedICE(cis);
      expect(ICE.isICE(earnedICE)).to.be.true;
      expect(earnedICE.i).to.be.equal(0);
      expect(earnedICE.c).to.be.equal(80);
      expect(earnedICE.e).to.be.equal(0);
      const projectedICE = ICE.getProjectedICE(cis);
      expect(ICE.isICE(projectedICE)).to.be.true;
      expect(projectedICE.i).to.be.equal(0);
      expect(projectedICE.c).to.be.equal(116);
      expect(projectedICE.e).to.be.equal(0);
      removeAllEntities();
      done();
    });
  });
}
