import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { AcademicTerms } from './AcademicTermCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('AcademicTermCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#get, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2010 });
      expect(AcademicTerms.isDefined(docID)).to.be.true;
      let dumpObject = AcademicTerms.dumpOne(docID);
      expect(dumpObject.retired).to.be.false;
      expect(AcademicTerms.countNonRetired()).to.equal(1);
      AcademicTerms.update(docID, { retired: true });
      expect(AcademicTerms.countNonRetired()).to.equal(0);
      AcademicTerms.removeIt(docID);
      expect(AcademicTerms.isDefined(docID)).to.be.false;
      docID = AcademicTerms.restoreOne(dumpObject);
      expect(AcademicTerms.isDefined(docID)).to.be.true;
      AcademicTerms.update(docID, { retired: true });
      dumpObject = AcademicTerms.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
      AcademicTerms.removeIt(docID);
    });

    it('#get (multiple definition)', function test() {
      const termID = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2012 });
      const termID2 = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2012 });
      expect(termID).to.equal(termID2);
      AcademicTerms.removeIt(termID);
      expect(AcademicTerms.isDefined(termID2)).to.be.false;
    });

    it('#assertAcademicTerm', function test() {
      const termID = AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2015 });
      expect(function foo() {
        AcademicTerms.assertAcademicTerm(undefined);
      }).to.throw(Error);
      expect(function foo() {
        AcademicTerms.assertAcademicTerm(termID);
      }).to.not.throw(Error);
      AcademicTerms.removeIt(termID);
      expect(function foo() {
        AcademicTerms.assertAcademicTerm(termID);
      }).to.throw(Error);
    });

    it('#toString', function test() {
      const termID = AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2010 });
      expect(AcademicTerms.toString(termID)).to.equal('Spring 2010');
      AcademicTerms.removeIt(termID);
    });

    it('#termNumber', function test() {
      let termID = AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2011 });
      expect(AcademicTerms.findDoc(termID).termNumber).to.equal(1);

      termID = AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2011 });
      expect(AcademicTerms.findDoc(termID).termNumber).to.equal(2);

      termID = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2011 });
      expect(AcademicTerms.findDoc(termID).termNumber).to.equal(3);

      termID = AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2012 });
      expect(AcademicTerms.findDoc(termID).termNumber).to.equal(4);

      termID = AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2012 });
      expect(AcademicTerms.findDoc(termID).termNumber).to.equal(5);

      termID = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2012 });
      expect(AcademicTerms.findDoc(termID).termNumber).to.equal(6);
    });

    it('#getID', function test() {
      expect(AcademicTerms.getID('Summer-2010')).to.be.a('string');
      expect(AcademicTerms.getID('Summer-2040')).to.be.a('string');
      expect(function foo() {
        AcademicTerms.getID('foobar');
      }).to.throw(Error);
    });

    it('#getShortName', function test() {
      const termID = AcademicTerms.getID('Summer-2010');
      expect(AcademicTerms.getShortName(termID)).to.equal('Sum 10');
    });
  });
}
