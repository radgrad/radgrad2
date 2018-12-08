import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { AcademicTerms } from './AcademicTermCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* tslint:disable:ter-prefer-arrow-callback no-unused-expression */

if (Meteor.isServer) {
  describe('SemesterCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#get, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2010 });
      expect(AcademicTerms.isDefined(docID)).to.be.true;
      const dumpObject = AcademicTerms.dumpOne(docID);
      expect(AcademicTerms.countNonRetired()).to.equal(1);
      AcademicTerms.update(docID, { retired: true });
      expect(AcademicTerms.countNonRetired()).to.equal(0);
      AcademicTerms.removeIt(docID);
      expect(AcademicTerms.isDefined(docID)).to.be.false;
      docID = AcademicTerms.restoreOne(dumpObject);
      expect(AcademicTerms.isDefined(docID)).to.be.true;
      AcademicTerms.removeIt(docID);
    });

    it('#get (multiple definition)', function test() {
      const semesterID = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2012 });
      const semesterID2 = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2012 });
      expect(semesterID).to.equal(semesterID2);
      AcademicTerms.removeIt(semesterID);
      expect(AcademicTerms.isDefined(semesterID2)).to.be.false;
    });

    it('#assertSemester', function test() {
      const semesterID = AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2015 });
      expect(function foo() { AcademicTerms.assertSemester(semesterID); }).to.not.throw(Error);
      AcademicTerms.removeIt(semesterID);
      expect(function foo() { AcademicTerms.assertSemester(semesterID); }).to.throw(Error);
    });

    it('#toString', function test() {
      const semesterID = AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2010 });
      expect(AcademicTerms.toString(semesterID)).to.equal('Spring 2010');
      AcademicTerms.removeIt(semesterID);
    });

    it('#semesterNumber', function test() {
      let semesterID = AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2011 });
      expect(AcademicTerms.findDoc(semesterID).semesterNumber).to.equal(1);

      semesterID = AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2011 });
      expect(AcademicTerms.findDoc(semesterID).semesterNumber).to.equal(2);

      semesterID = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2011 });
      expect(AcademicTerms.findDoc(semesterID).semesterNumber).to.equal(3);

      semesterID = AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2012 });
      expect(AcademicTerms.findDoc(semesterID).semesterNumber).to.equal(4);

      semesterID = AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2012 });
      expect(AcademicTerms.findDoc(semesterID).semesterNumber).to.equal(5);

      semesterID = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2012 });
      expect(AcademicTerms.findDoc(semesterID).semesterNumber).to.equal(6);
    });

    it('#getID', function test() {
      expect(AcademicTerms.getID('Summer-2010')).to.be.a('string');
      expect(AcademicTerms.getID('Summer-2040')).to.be.a('string');
      expect(function foo() { AcademicTerms.getID('foobar'); }).to.throw(Error);
    });

    it('#getShortName', function test() {
      const semesterID = AcademicTerms.getID('Summer-2010');
      expect(AcademicTerms.getShortName(semesterID)).to.equal('Sum 10');
    });
  });
}
