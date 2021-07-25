import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import { removeAllEntities } from '../base/BaseUtilities';
import { Slugs } from '../slug/SlugCollection';
import { Interests } from './InterestCollection';
import { InterestKeywords } from './InterestKeywordCollection';
import { makeSampleInterest } from './SampleInterests';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('InterestKeywordCollection', function testSuite() {
    let interestDoc;
    let interest;

    before(function setup() {
      removeAllEntities();
      const interestID = makeSampleInterest();
      interestDoc = Interests.findDoc(interestID);
      interest = Slugs.getNameFromID(interestDoc.slugID);
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.lorem(1), fc.boolean(), (keyword, retired) => {
          const docID = InterestKeywords.define({ interest, keyword, retired });
          expect(InterestKeywords.isDefined(docID)).to.be.true;
          InterestKeywords.removeIt(docID);
          expect(InterestKeywords.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Defining duplicates returns the same ID', function test2() {
      const keyword = 'keyword';
      const docID1 = InterestKeywords.define({ interest, keyword });
      const docID2 = InterestKeywords.define({ interest, keyword });
      expect(docID1).to.equal(docID2);
      expect(InterestKeywords.isDefined(docID1)).to.be.true;
    });

    it('Can update', function test3(done) {
      const keyword = 'keyword';
      const docID = InterestKeywords.define({ interest, keyword });
      fc.assert(
        fc.property(fc.lorem(1), fc.boolean(), (newKeyword, retired) => {
          InterestKeywords.update(docID, { keyword: newKeyword, retired });
          const doc = InterestKeywords.findDoc(docID);
          expect(doc.keyword).to.equal(newKeyword);
          expect(doc.retired).to.equal(retired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const doc = InterestKeywords.findOne({});
      let docID = doc._id;
      const dumpObject = InterestKeywords.dumpOne(docID);
      InterestKeywords.removeIt(docID);
      expect(InterestKeywords.isDefined(docID)).to.be.false;
      docID = InterestKeywords.define(dumpObject);
      expect(InterestKeywords.isDefined(docID)).to.be.true;
      const restored = InterestKeywords.findDoc(docID);
      expect(restored.interestID).to.equal(doc.interestID);
      expect(restored.keyword).to.equal(doc.keyword);
      expect(restored.retired).to.equal(doc.retired);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = InterestKeywords.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });
  });
}
