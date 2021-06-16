import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import { Review, ReviewRatings } from '../../typings/radgrad';
import { makeSampleAcademicTerm } from '../academic-term/SampleAcademicTerms';
import { makeSampleCourse } from '../course/SampleCourses';
import { ROLE } from '../role/Role';
import { Reviews } from './ReviewCollection';
import { makeSampleOpportunity } from '../opportunity/SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { ReviewTypes } from './ReviewTypes';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('ReviewCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.lorem(1), fc.boolean(), fc.integer(1, 5), fc.lorem(10), (fcSlug, cOrO, fcRating, fcComments) => {
          let reviewType;
          const reviewRating: ReviewRatings = fcRating as ReviewRatings;
          let reviewee;
          const academicTerm = makeSampleAcademicTerm();
          const student: string = makeSampleUser();
          if (cOrO) {
            reviewType = ReviewTypes.COURSE;
            reviewee = makeSampleCourse();
          } else {
            reviewType = ReviewTypes.OPPORTUNITY;
            const sponsor = makeSampleUser(ROLE.FACULTY);
            reviewee = makeSampleOpportunity(sponsor);
          }
          const localSlug = `${fcSlug}-${new Date().getTime()}`;
          const docID = Reviews.define({
            slug: localSlug,
            student,
            reviewType,
            reviewee,
            academicTerm,
            rating: reviewRating,
            comments: fcComments,
          });
          expect(Reviews.isDefined(docID)).to.be.true;
          Reviews.removeIt(docID);
          expect(Reviews.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Can not define duplicates', function test2(done) {
      const slug: string = faker.lorem.word();
      const student: string = makeSampleUser();
      const reviewType = ReviewTypes.OPPORTUNITY;
      const faculty: string = makeSampleUser(ROLE.FACULTY);
      const reviewee: string = makeSampleOpportunity(faculty);
      const academicTerm = makeSampleAcademicTerm();
      const rating: ReviewRatings = 2;
      const comments = faker.lorem.paragraph();
      Reviews.define({
        slug,
        student,
        reviewType,
        reviewee,
        academicTerm,
        rating,
        comments,
      });
      expect(() =>
        Reviews.define({
          slug,
          student,
          reviewType,
          reviewee,
          academicTerm,
          rating,
          comments,
        }),
      ).to.throw(Error);
      done();
    });

    it('Can update', function test3(done) {
      let doc = Reviews.findOne({});
      const docID = doc._id;
      fc.assert(
        fc.property(fc.integer(1, 5), fc.lorem(10), fc.boolean(), fc.boolean(), fc.lorem(10), fc.boolean(), (ratingNum, comments, moderated, visible, moderatorComments, retired) => {
          const academicTerm = makeSampleAcademicTerm();
          const rating: ReviewRatings = ratingNum as ReviewRatings;
          Reviews.update(docID, { academicTerm, comments, moderated, visible, rating, retired, moderatorComments });
          doc = Reviews.findDoc(docID);
          expect(doc.comments).to.equal(comments);
          expect(doc.moderated).to.equal(moderated);
          expect(doc.visible).to.equal(visible);
          expect(doc.rating).to.equal(rating);
          expect(doc.retired).to.equal(retired);
          expect(doc.moderatorComments).to.equal(moderatorComments);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const origDoc = Reviews.findOne({});
      let docID = origDoc._id;
      const dumpObject = Reviews.dumpOne(docID);
      Reviews.removeIt(docID);
      expect(Reviews.isDefined(docID)).to.be.false;
      docID = Reviews.restoreOne(dumpObject);
      const restored: Review = Reviews.findDoc(docID);
      expect(restored.comments).to.equal(origDoc.comments);
      expect(restored.reviewType).to.equal(origDoc.reviewType);
      expect(restored.moderated).to.equal(origDoc.moderated);
      expect(restored.visible).to.equal(origDoc.visible);
      expect(restored.moderatorComments).to.equal(origDoc.moderatorComments);
      expect(restored.retired).to.equal(origDoc.retired);
    });

    it('Can checkIntegrity no errors', function test5() {
      const problems = Reviews.checkIntegrity();
      expect(problems.length).to.equal(0);
    });

    it('Can dumpUser', function test6() {
      const numToMake = 10;
      const existingReviewCount = Reviews.count();
      const student: string = makeSampleUser();
      for (let i = 0; i < numToMake; i++) {
        const reviewType = ReviewTypes.OPPORTUNITY;
        const faculty: string = makeSampleUser(ROLE.FACULTY);
        const reviewee: string = makeSampleOpportunity(faculty);
        const academicTerm = makeSampleAcademicTerm();
        const rating: ReviewRatings = Math.floor(Math.random() * 5 + 1) as ReviewRatings;
        const comments = faker.lorem.paragraph();
        const slug = `review-${student}-${reviewee}-${rating}`;
        Reviews.define({ slug, student, reviewType, reviewee, academicTerm, rating, comments });
      }
      const reviewCount = Reviews.count();
      expect(reviewCount).to.equal(existingReviewCount + numToMake);
      const userDump = Reviews.dumpUser(student);
      expect(userDump.length).to.equal(numToMake);
    });
  });
}
