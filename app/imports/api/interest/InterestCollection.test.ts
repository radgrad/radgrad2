import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import 'mocha';
import { Interests } from './InterestCollection';
import { makeSampleInterestType } from './SampleInterests';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('InterestCollection', function testSuite() {

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(50000);
      const interestTypeID = makeSampleInterestType();
      fc.assert(
        fc.property(fc.lorem(3), fc.lorem(1), fc.lorem(24), fc.boolean(), (fcName, fcSlug, fcDescription, fcRetired) => {
          const docID = Interests.define({ name: fcName, slug: fcSlug, description: fcDescription, interestType: interestTypeID, retired: fcRetired });
          expect(Interests.isDefined(docID)).to.be.true;
          const interestDoc = Interests.findDoc(docID);
          expect(interestDoc.name).to.equal(fcName);
          expect(interestDoc.description).to.equal(fcDescription);
          expect(interestDoc.interestTypeID).to.equal(interestTypeID);
          expect(interestDoc.retired).to.equal(fcRetired);
          Interests.removeIt(docID);
          expect(Interests.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Cannot define duplicates', function test2() {
      const interestTypeID = makeSampleInterestType();
      const name = faker.lorem.words();
      const slug = faker.lorem.word();
      const description = faker.lorem.paragraph();
      const docID1 = Interests.define({ name, slug, description, interestType: interestTypeID });
      expect(Interests.isDefined(docID1)).to.be.true;
      expect(() => Interests.define({ name, slug, description, interestType: interestTypeID })).to.throw(Error);
    });

    it('Can update', function test3(done) {
      this.timeout(50000);
      let interestDoc = Interests.findOne({});
      const docID = interestDoc._id;
      fc.assert(
        fc.property(fc.lorem(4), fc.lorem(24), fc.boolean(), (fcName, fcDescription, fcRetired) => {
          const interestType = makeSampleInterestType();
          Interests.update(docID, { name: fcName, description: fcDescription, interestType, retired: fcRetired });
          interestDoc = Interests.findDoc(docID);
          expect(interestDoc.name).to.equal(fcName);
          expect(interestDoc.description).to.equal(fcDescription);
          expect(interestDoc.interestTypeID).to.equal(interestType);
          expect(interestDoc.retired).to.equal(fcRetired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let interestDoc = Interests.findOne({});
      let docID = interestDoc._id;
      const dumpObject = Interests.dumpOne(docID);
      Interests.removeIt(docID);
      expect(Interests.isDefined(docID)).to.be.false;
      docID = Interests.restoreOne(dumpObject);
      interestDoc = Interests.findDoc(docID);
      expect(interestDoc.name).to.equal(dumpObject.name);
      expect(interestDoc.description).to.equal(dumpObject.description);
      expect(interestDoc.retired).to.equal(dumpObject.retired);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = Interests.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });

    // it('#assertDefined, assertAllDefined', function test() {
    //   const docID = Interests.define(interest1);
    //   expect(function foo() { Interests.assertDefined(docID); }).to.not.throw(Error);
    //   expect(function foo() { Interests.assertDefined('foo'); }).to.throw(Error);
    //   const docID2 = Interests.define(interest2);
    //   expect(function foo() { Interests.assertAllDefined([docID, docID2]); }).to.not.throw(Error);
    //   expect(function foo() { Interests.assertAllDefined(['foo']); }).to.throw(Error);
    //   Interests.removeIt(slug);
    //   Interests.removeIt(slug2);
    // });

    // it('#find, #findDoc, #findDocBySlug, #findIdBySlug, #findIdsBySlugs, #findNames', function test() {
    //   const docID = Interests.define(interest1);
    //   const docID2 = Interests.define(interest2);
    //   expect(Interests.find().fetch()).to.have.lengthOf(2);
    //   expect(function foo() { Interests.findDoc(docID); }).to.not.throw(Error);
    //   expect(function foo() { Interests.findDoc('foo'); }).to.throw(Error);
    //   expect(function foo() { Interests.findDocBySlug(slug); }).to.not.throw(Error);
    //   expect(function foo() { Interests.findDocBySlug('foo'); }).to.throw(Error);
    //   expect(function foo() { Interests.findIdBySlug(slug); }).to.not.throw(Error);
    //   expect(function foo() { Interests.findIdsBySlugs([slug, slug2]); }).to.not.throw(Error);
    //   expect(function foo() { Interests.findIdsBySlugs([slug, 'foo']); }).to.throw(Error);
    //   expect(function foo() { Interests.findNames([docID, docID2]); }).to.not.throw(Error);
    //   expect(function foo() { Interests.findNames([docID, 'foo']); }).to.throw(Error);
    //   Interests.removeIt(slug);
    //   Interests.removeIt(slug2);
    // });

    // it('#hasSlug', function test() {
    //   const docID = Interests.define(interest1);
    //   const slugID = Interests.findDoc(docID).slugID;
    //   expect(Interests.hasSlug(slugID)).to.be.true;
    //   expect(Interests.hasSlug('foo')).to.be.false;
    //   Interests.removeIt(slug);
    // });
  });
}
