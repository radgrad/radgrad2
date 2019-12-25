import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { defineAcademicTerms, nextAcademicTerm, upComingTerms } from './AcademicTermUtilities';
import { removeAllEntities } from '../base/BaseUtilities';
import { AcademicTerms } from './AcademicTermCollection';

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

    it('#nextAcademicTerm', function test() {
      const currentAcademicTerm = AcademicTerms.getCurrentAcademicTermDoc();
      const next = nextAcademicTerm(currentAcademicTerm);
      expect(next.termNumber).to.equal(currentAcademicTerm.termNumber + 1);
    });

    it('#upComingTerms', function test() {
      const count = AcademicTerms.find({}).count();
      expect(count).to.be.equal(18);
      const upComing = upComingTerms();
      // console.log(upComing);
      expect(upComing.length).to.be.equal(9); // TODO This will change over time unless we change defineAcademicTerms.
    });
  });
}
