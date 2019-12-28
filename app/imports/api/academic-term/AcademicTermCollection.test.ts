import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { AcademicTerms } from './AcademicTermCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('AcademicTermCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define, even multiple times', function test1() {
      const termID = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2019 });
      const termID2 = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2019 });
      expect(termID).to.equal(termID2);
      expect(AcademicTerms.isDefined(termID)).to.be.true;
      expect(AcademicTerms.isDefined(termID2)).to.be.true;
    });

    it('Can update retired flag', function test2() {
      const docID = AcademicTerms.findIdBySlug('Fall-2019');
      AcademicTerms.update(docID, { retired: true });
      const terms = AcademicTerms.findNonRetired();
      expect(terms.length).to.equal(0);
    });

    it('Can dump, removeIt and restore', function test3() {
      let docID = AcademicTerms.findIdBySlug('Fall-2019');
      const dumpObject = AcademicTerms.dumpOne(docID);
      AcademicTerms.removeIt(docID);
      expect(AcademicTerms.isDefined(docID)).to.be.false;
      docID = AcademicTerms.restoreOne(dumpObject);
      expect(AcademicTerms.isDefined(docID)).to.be.true;
    });

    it('Can assertAcademicTerm', function test4() {
      const termID = AcademicTerms.findIdBySlug('Fall-2019');
      expect(function () { AcademicTerms.assertAcademicTerm(termID); }).to.not.throw();
      expect(function () { AcademicTerms.assertAcademicTerm('Fall-2019'); }).to.not.throw();
      expect(function () { AcademicTerms.assertAcademicTerm(''); }).to.throw();
    });

    it('Can toString', function test5() {
      const termID = AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2010 });
      expect(AcademicTerms.toString(termID)).to.equal('Spring 2010');
      AcademicTerms.removeIt(termID);
    });

    it('Can get the right termNumber', function test6() {
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

    it('Can getID', function test7() {
      expect(AcademicTerms.getID('Summer-2010')).to.be.a('string');
      expect(AcademicTerms.getID('Summer-2040')).to.be.a('string');
      expect(function () { AcademicTerms.getID('foobar'); }).to.throw();
    });

    it('Can getShortName', function test8() {
      const termID = AcademicTerms.getID('Summer-2010');
      expect(AcademicTerms.getShortName(termID)).to.equal('Sum 10');
    });
  });
}
