import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import { removeAllEntities } from '../base/BaseUtilities';
import { PageInterestsDailySnapshots } from './PageInterestsDailySnapshotCollection';
import {
  makeSamplePageInterestInfoArray,
  makeSamplePageInterestsDailySnapshot,
} from './SamplePageInterestsDailySnapshots';
import {
  IPageInterestInfo,
  IPageInterestsDailySnapshot,
  IPageInterestsDailySnapshotDefine,
} from '../../typings/radgrad';

/* eslint @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('PageInterestsDailySnapshotCollection', function testSuite() {

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(5000);
      fc.assert(
        fc.property(fc.nat(100), fc.nat(100), fc.nat(100), fc.nat(100), (careerGoalsNum, coursesNum, interestsNum, opportunitiesNum) => {
          const careerGoals: IPageInterestInfo[] = makeSamplePageInterestInfoArray(careerGoalsNum);
          const courses: IPageInterestInfo[] = makeSamplePageInterestInfoArray(coursesNum);
          const interests: IPageInterestInfo[] = makeSamplePageInterestInfoArray(interestsNum);
          const opportunities: IPageInterestInfo[] = makeSamplePageInterestInfoArray(opportunitiesNum);
          const docID = PageInterestsDailySnapshots.define({ careerGoals, courses, interests, opportunities });

          expect(PageInterestsDailySnapshots.isDefined(docID)).to.be.true;
          PageInterestsDailySnapshots.removeIt(docID);
          expect(PageInterestsDailySnapshots.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Cannot define duplicates', function test2() {
      const numItems = 5;
      const careerGoals: IPageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
      const courses: IPageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
      const interests: IPageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
      const opportunities: IPageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);

      // Snapshot with the same values for all its fields
      let docID1 = PageInterestsDailySnapshots.define({ careerGoals, courses, interests, opportunities });
      let docID1Object: IPageInterestsDailySnapshot = PageInterestsDailySnapshots.findOne({ _id: docID1 });
      let docID2 = PageInterestsDailySnapshots.define({
        careerGoals,
        courses,
        interests,
        opportunities,
        timestamp: docID1Object.timestamp,
      });

      expect(docID1).to.equal(docID2);
      expect(PageInterestsDailySnapshots.isDefined(docID1)).to.be.true;
      PageInterestsDailySnapshots.removeIt(docID2);
      expect(PageInterestsDailySnapshots.isDefined(docID1)).to.be.false;

      // Snapshot with the same values for all its fields created the same day
      Meteor.setTimeout(() => {
        docID1 = PageInterestsDailySnapshots.define({ careerGoals, courses, interests, opportunities });
        docID2 = PageInterestsDailySnapshots.define({ careerGoals, courses, interests, opportunities });
        docID1Object = PageInterestsDailySnapshots.findOne({ _id: docID1 });
        const docID2Object: IPageInterestsDailySnapshot = PageInterestsDailySnapshots.findOne({ _id: docID2 });
        expect(docID1Object.timestamp).to.be.below(docID2Object.timestamp);
        expect(docID1).to.equal(docID2);
        expect(PageInterestsDailySnapshots.isDefined(docID1)).to.be.true;
        PageInterestsDailySnapshots.removeIt(docID2);
        expect(PageInterestsDailySnapshots.isDefined(docID1)).to.be.false;
      }, 500);
    });

    it('Can dumpOne, removeIt, and restoreOne', function test3() {
      let docID = makeSamplePageInterestsDailySnapshot();
      const original: IPageInterestsDailySnapshot = PageInterestsDailySnapshots.findDoc(docID);
      const dumpObject: IPageInterestsDailySnapshotDefine = PageInterestsDailySnapshots.dumpOne(docID);
      PageInterestsDailySnapshots.removeIt(docID);
      expect(PageInterestsDailySnapshots.isDefined(docID)).to.be.false;

      docID = PageInterestsDailySnapshots.restoreOne(dumpObject);
      expect(PageInterestsDailySnapshots.isDefined(docID)).to.be.true;

      const restored: IPageInterestsDailySnapshot = PageInterestsDailySnapshots.findDoc(docID);
      expect(original.careerGoals).to.deep.equal(restored.careerGoals);
      expect(original.courses).to.deep.equal(restored.courses);
      expect(original.interests).to.deep.equal(restored.interests);
      expect(original.opportunities).to.deep.equal(restored.opportunities);
      expect(original.timestamp).to.deep.equal(restored.timestamp);
      expect(original.retired).to.deep.equal(restored.retired);

    });

    it('Can checkIntegrity no errors', function test4() {
      const pageInterestsDailySnapshot: IPageInterestsDailySnapshot = PageInterestsDailySnapshots.findOne({});
      const errors = PageInterestsDailySnapshots.checkIntegrity();
      const { careerGoals, courses, interests, opportunities } = pageInterestsDailySnapshot;
      const numSlugs = careerGoals.length + courses.length + interests.length + opportunities.length;

      // When we call makeSamplePageInterestsDailySnapshot we don't create the random slugs that it generates
      expect(errors.length).to.equal(numSlugs);
    });
  });
}
