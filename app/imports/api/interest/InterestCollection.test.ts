import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import 'mocha';
import { Interests } from './InterestCollection';
import { makeSampleInterestType } from './SampleInterests';
import { removeAllEntities } from '../base/BaseUtilities';
import { defineTestFixtures } from '../test/test-utilities';

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
      const interestTypeID = makeSampleInterestType();
      fc.assert(
        fc.property(fc.lorem(3), fc.lorem(1), fc.lorem(24), fc.boolean(), (fcName, fcSlug, fcDescription, fcRetired) => {
          const localSlug = `${fcSlug}-${new Date().getTime()}`;
          const docID = Interests.define({ name: fcName, slug: localSlug, description: fcDescription, interestType: interestTypeID, retired: fcRetired });
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

    it('Can findRelatedCareerGoals', function test6() {
      defineTestFixtures(['minimal', 'betty.student']);
      let interest = Interests.findDoc('Algorithms');
      let relatedCareerGoals = Interests.findRelatedCareerGoals(interest._id);
      expect(relatedCareerGoals.length).to.equal(2);
      interest = Interests.findDoc('Java');
      relatedCareerGoals = Interests.findRelatedCareerGoals(interest._id);
      expect(relatedCareerGoals.length).to.equal(0);
    });

    it('Can findRelatedCourses', function test7() {
      let interest = Interests.findDoc('Algorithms');
      let relatedCourses = Interests.findRelatedCourses(interest._id);
      expect(relatedCourses.length).to.equal(1);
      interest = Interests.findDoc('Java');
      relatedCourses = Interests.findRelatedCourses(interest._id);
      expect(relatedCourses.length).to.equal(1);
    });

    it('Can findRelatedOpportunities', function test8() {
      defineTestFixtures(['opportunities']);
      let interest = Interests.findDoc('Algorithms');
      let relatedOpportunities = Interests.findRelatedOpportunities(interest._id);
      expect(relatedOpportunities.length).to.equal(1);
      interest = Interests.findDoc('Java');
      relatedOpportunities = Interests.findRelatedOpportunities(interest._id);
      expect(relatedOpportunities.length).to.equal(1);
    });
  });
}
