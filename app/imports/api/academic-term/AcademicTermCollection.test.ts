import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import 'mocha';
// import { RadGradProperties } from '../radgrad/RadGradProperties';
import { AcademicTerms } from './AcademicTermCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { Slugs } from '../slug/SlugCollection';
// import { defineAcademicTerms } from './AcademicTermUtilities';

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

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.integer(2017, 2027), fc.boolean(), (fcYear, fcRetired) => {
          const term = AcademicTerms.terms[faker.random.number({ min: 0, max: AcademicTerms.terms.length - 1 })];
          const docID = AcademicTerms.define({ term, year: fcYear, retired: fcRetired });
          expect(AcademicTerms.isDefined(docID)).to.be.true;
          AcademicTerms.removeIt(docID);
          expect(AcademicTerms.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Cannot define duplicates', function test2() {
      const termID = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2019 });
      const termID2 = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2019 });
      expect(termID).to.equal(termID2);
      expect(AcademicTerms.isDefined(termID)).to.be.true;
      expect(AcademicTerms.isDefined(termID2)).to.be.true;
    });

    it('Can update', function test3(done) {
      let doc = AcademicTerms.findOne({});
      const docID = doc._id;
      fc.assert(
        fc.property(fc.boolean(), (fcRetired) => {
          AcademicTerms.update(docID, { retired: fcRetired });
          doc = AcademicTerms.findDoc(docID);
          expect(doc.retired).to.equal(fcRetired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let doc = AcademicTerms.findOne({});
      let docID = doc._id;
      const dumpObject = AcademicTerms.dumpOne(docID);
      AcademicTerms.removeIt(docID);
      expect(AcademicTerms.isDefined(docID)).to.be.false;
      docID = AcademicTerms.restoreOne(dumpObject);
      expect(AcademicTerms.isDefined(docID)).to.be.true;
      doc = AcademicTerms.findDoc(docID);
      expect(doc.term).to.equal(dumpObject.term);
      expect(doc.year).to.equal(dumpObject.year);
      expect(doc.retired).to.equal(dumpObject.retired);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = AcademicTerms.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });

    /* ===================== AcademicTerm method tests ===================== */

    it('Can assertAcademicTerm', function test6() {
      const academicTermDoc = AcademicTerms.findOne({});
      const termID = academicTermDoc._id;
      const slug = Slugs.getNameFromID(academicTermDoc.slugID);
      expect(() => { AcademicTerms.assertAcademicTerm(termID); }).to.not.throw();
      expect(() => { AcademicTerms.assertAcademicTerm(slug); }).to.not.throw();
      expect(() => { AcademicTerms.assertAcademicTerm(''); }).to.throw();
    });

    it('Can findIdBySlug', function test7() {
      const academicTermDoc = AcademicTerms.findOne({});
      const termID = academicTermDoc._id;
      const slug = Slugs.getNameFromID(academicTermDoc.slugID);
      const id = AcademicTerms.findIdBySlug(slug);
      expect(id).to.equal(termID);
      expect(() => AcademicTerms.findIdBySlug('badSlug')).to.throw();
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

    // it('Can getNextYears', function test9() {
    //   defineAcademicTerms();
    //   const fourYears = RadGradProperties.getQuarterSystem() ? 16 : 12;
    //   const currentTermNumber = AcademicTerms.getCurrentAcademicTermDoc().termNumber;
    //   const startOfAcademicYear = AcademicTerms.getStartOfCurrentAcademicYearTerm().termNumber;
    //   const diff = currentTermNumber - startOfAcademicYear;
    //   const terms = AcademicTerms.getNextYears(4);
    //   expect(terms.length).to.equal(fourYears - diff);
    //   expect(terms[0].termNumber).to.equal(currentTermNumber);
    // });
  });
}
