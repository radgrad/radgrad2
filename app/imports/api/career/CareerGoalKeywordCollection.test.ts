import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import { removeAllEntities } from '../base/BaseUtilities';
import { Slugs } from '../slug/SlugCollection';
import { CareerGoals } from './CareerGoalCollection';
import { CareerGoalKeywords } from './CareerGoalKeywordCollection';
import { makeSampleCareerGoal } from './SampleCareerGoals';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('CareerGoalKeywordCollection', function testSuite() {
    let careerGoalDoc;
    let careerGoal;

    before(function setup() {
      removeAllEntities();
      const careerGoalID = makeSampleCareerGoal();
      careerGoalDoc = CareerGoals.findDoc(careerGoalID);
      careerGoal = Slugs.getNameFromID(careerGoalDoc.slugID);
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.lorem(2), fc.boolean(), (keyword, retired) => {
          const docID = CareerGoalKeywords.define({ careerGoal, keyword, retired });
          expect(CareerGoalKeywords.isDefined(docID)).to.be.true;
          CareerGoalKeywords.removeIt(docID);
          expect(CareerGoalKeywords.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Defining duplicates returns the same ID', function test2() {
      const keyword = 'keyword';
      const docID1 = CareerGoalKeywords.define({ careerGoal, keyword });
      const docID2 = CareerGoalKeywords.define({ careerGoal, keyword });
      expect(docID1).to.equal(docID2);
      expect(CareerGoalKeywords.isDefined(docID1)).to.be.true;
    });

    it('Can update', function test3(done) {
      const keyword = 'keyword';
      const docID = CareerGoalKeywords.define({ careerGoal, keyword });
      fc.assert(
        fc.property(fc.lorem(1), fc.boolean(), (newKeyword, retired) => {
          CareerGoalKeywords.update(docID, { keyword: newKeyword, retired });
          const doc = CareerGoalKeywords.findDoc(docID);
          expect(doc.keyword).to.equal(newKeyword);
          expect(doc.retired).to.equal(retired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const doc = CareerGoalKeywords.findOne({});
      let docID = doc._id;
      const dumpObject = CareerGoalKeywords.dumpOne(docID);
      CareerGoalKeywords.removeIt(docID);
      expect(CareerGoalKeywords.isDefined(docID)).to.be.false;
      docID = CareerGoalKeywords.define(dumpObject);
      expect(CareerGoalKeywords.isDefined(docID)).to.be.true;
      const restored = CareerGoalKeywords.findDoc(docID);
      expect(restored.careerGoalID).to.equal(doc.careerGoalID);
      expect(restored.keyword).to.equal(doc.keyword);
      expect(restored.retired).to.equal(doc.retired);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = CareerGoalKeywords.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });
  });
}
