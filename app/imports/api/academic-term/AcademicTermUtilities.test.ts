import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { defineAcademicTerms, nextAcademicTerm, upComingTerms } from './AcademicTermUtilities';
import { removeAllEntities } from '../base/BaseUtilities';
import { AcademicTerms } from './AcademicTermCollection';
import { RadGradSettings } from '../radgrad/RadGradSettingsCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('AcademicTermUtilities', function testSuite() {
    before(function setup() {
      removeAllEntities();
      defineAcademicTerms();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can get nextAcademicTerm', function test1() {
      const currentAcademicTerm = AcademicTerms.getCurrentAcademicTermDoc();
      const next = nextAcademicTerm(currentAcademicTerm);
      expect(next.termNumber).to.equal(currentAcademicTerm.termNumber + 1);
    });

    it('Can get upComingTerms', function test2() {
      const settingsDoc = RadGradSettings.findOne({});
      let termCount;
      if (settingsDoc.quarterSystem) {
        termCount = 20;
      } else {
        termCount = 15;
      }
      const count = AcademicTerms.find({}).count();
      expect(count).to.be.equal(termCount);
      const upComing = upComingTerms();
      // console.log(upComing);
      expect(upComing.length).to.be.equal(9);
    });
  });
}
