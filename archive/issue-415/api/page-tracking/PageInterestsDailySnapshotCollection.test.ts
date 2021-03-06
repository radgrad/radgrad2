import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import moment from 'moment';
import { removeAllEntities } from '../../../../app/imports/api/base/BaseUtilities';
import { PageInterestsDailySnapshots } from './PageInterestsDailySnapshotCollection';
import {
  makeSamplePageInterestInfoArray,
  makeSamplePageInterestsDailySnapshot,
} from './SamplePageInterestsDailySnapshots';
import {
  PageInterestInfo,
  PageInterestsDailySnapshot,
  PageInterestsDailySnapshotDefine,
} from '../../../../app/imports/typings/radgrad';

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
      fc.assert(
        fc.property(fc.nat(100), fc.nat(100), fc.nat(100), fc.nat(100), (careerGoalsNum, coursesNum, interestsNum, opportunitiesNum) => {
          const careerGoals: PageInterestInfo[] = makeSamplePageInterestInfoArray(careerGoalsNum);
          const courses: PageInterestInfo[] = makeSamplePageInterestInfoArray(coursesNum);
          const interests: PageInterestInfo[] = makeSamplePageInterestInfoArray(interestsNum);
          const opportunities: PageInterestInfo[] = makeSamplePageInterestInfoArray(opportunitiesNum);
          const docID = PageInterestsDailySnapshots.define({ careerGoals, courses, interests, opportunities });
          const docObject: PageInterestsDailySnapshot = PageInterestsDailySnapshots.findOne({ _id: docID });

          expect(docObject.timestamp).to.be.below(new Date());
          expect(PageInterestsDailySnapshots.isDefined(docID)).to.be.true;
          PageInterestsDailySnapshots.removeIt(docID);
          expect(PageInterestsDailySnapshots.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Cannot define duplicate snapshots with the same value for all its fields', function test2() {
      const numItems = 5;
      const careerGoals: PageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
      const courses: PageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
      const interests: PageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
      const opportunities: PageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
      const docID1 = PageInterestsDailySnapshots.define({ careerGoals, courses, interests, opportunities });
      const docID1Object: PageInterestsDailySnapshot = PageInterestsDailySnapshots.findOne({ _id: docID1 });
      const docID2 = PageInterestsDailySnapshots.define({
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
    });

    it('Cannot define duplicate snapshots with the same values for all its fields created the same day', function test3() {
      const numItems = 5;
      const careerGoals: PageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
      const courses: PageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
      const interests: PageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
      const opportunities: PageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
      const docID1 = PageInterestsDailySnapshots.define({
        careerGoals,
        courses,
        interests,
        opportunities,
        timestamp: moment('2020-06-16T00:00').toDate(),
      });
      const docID2 = PageInterestsDailySnapshots.define({
        careerGoals,
        courses,
        interests,
        opportunities,
        timestamp: moment('2020-06-16T01:00').toDate(),
      });

      expect(docID1).to.equal(docID2);
      expect(PageInterestsDailySnapshots.isDefined(docID1)).to.be.true;
      PageInterestsDailySnapshots.removeIt(docID2);
      expect(PageInterestsDailySnapshots.isDefined(docID1)).to.be.false;
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let docID = makeSamplePageInterestsDailySnapshot();
      const original: PageInterestsDailySnapshot = PageInterestsDailySnapshots.findDoc(docID);
      const dumpObject: PageInterestsDailySnapshotDefine = PageInterestsDailySnapshots.dumpOne(docID);
      PageInterestsDailySnapshots.removeIt(docID);
      expect(PageInterestsDailySnapshots.isDefined(docID)).to.be.false;

      docID = PageInterestsDailySnapshots.restoreOne(dumpObject);
      expect(PageInterestsDailySnapshots.isDefined(docID)).to.be.true;

      const restored: PageInterestsDailySnapshot = PageInterestsDailySnapshots.findDoc(docID);
      expect(original.careerGoals).to.deep.equal(restored.careerGoals);
      expect(original.courses).to.deep.equal(restored.courses);
      expect(original.interests).to.deep.equal(restored.interests);
      expect(original.opportunities).to.deep.equal(restored.opportunities);
      expect(original.timestamp).to.deep.equal(restored.timestamp);
      expect(original.retired).to.deep.equal(restored.retired);

    });

    it('Can checkIntegrity no errors', function test5() {
      const pageInterestsDailySnapshot: PageInterestsDailySnapshot = PageInterestsDailySnapshots.findOne({});
      const errors = PageInterestsDailySnapshots.checkIntegrity();
      const { careerGoals, courses, interests, opportunities } = pageInterestsDailySnapshot;
      const numSlugs = careerGoals.length + courses.length + interests.length + opportunities.length;

      // When we call makeSamplePageInterestsDailySnapshot we don't create the random slugs that it generates
      expect(errors.length).to.equal(numSlugs);
    });
  });
}
