import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import { ROLE } from '../role/Role';
import { makeSampleUser, makeSampleUserArray } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { Feeds } from './FeedCollection';
import { Users } from '../user/UserCollection';
import { Courses } from '../course/CourseCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { makeSampleAcademicTermSlug } from '../academic-term/SampleAcademicTerms';
import { makeSampleCourse } from '../course/SampleCourses';
import { makeSampleOpportunity } from '../opportunity/SampleOpportunities';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FeedCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.integer(0, 6), fc.integer(1, 6), (choice, level) => {
          const sponsor = makeSampleUser(ROLE.FACULTY);
          let docID;
          switch (choice) {
            case 0:
              docID = Feeds.define({
                feedType: Feeds.NEW_USER,
                user: Users.getProfile(makeSampleUser()).username,
              });
              break;
            case 1:
              docID = Feeds.define({
                feedType: Feeds.NEW_COURSE,
                course: Courses.findSlugByID(makeSampleCourse()),
              });
              break;
            case 2:
              docID = Feeds.define({
                feedType: Feeds.NEW_OPPORTUNITY,
                opportunity: Opportunities.findSlugByID(makeSampleOpportunity(sponsor)),
              });
              break;
            case 3:
              docID = Feeds.define({
                feedType: Feeds.VERIFIED_OPPORTUNITY,
                user: Users.getProfile(makeSampleUser()).username,
                opportunity: Opportunities.findSlugByID(makeSampleOpportunity(sponsor)),
                academicTerm: makeSampleAcademicTermSlug(),
              });
              break;
            case 4:
              docID = Feeds.define({
                feedType: Feeds.NEW_COURSE_REVIEW,
                user: Users.getProfile(makeSampleUser()).username,
                course: Courses.findSlugByID(makeSampleCourse()),
              });
              break;
            case 5:
              docID = Feeds.define({
                feedType: Feeds.NEW_OPPORTUNITY_REVIEW,
                user: Users.getProfile(makeSampleUser()).username,
                opportunity: Opportunities.findSlugByID(makeSampleOpportunity(sponsor)),
              });
              break;
            default:
              docID = Feeds.define({
                feedType: Feeds.NEW_LEVEL,
                user: Users.getProfile(makeSampleUser()).username,
                level,
              });
          }
          expect(Feeds.isDefined(docID)).to.be.true;
          Feeds.removeIt(docID);
          expect(Feeds.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Cannot define duplicates', function test2() { // Test if duplicate documents can be defined
      const user = Users.getProfile(makeSampleUser()).username;
      const docID = Feeds.define({
        feedType: Feeds.NEW_USER,
        user,
      });
      expect(Feeds.isDefined(docID)).to.be.true;
      const docID2 = Feeds.define({
        feedType: Feeds.NEW_USER,
        user,
      });
      expect(docID).to.equal(docID2);
      expect(Feeds.isDefined(docID2)).to.be.true;
    });

    it('Can update', function test3(done) { // Test updating documents
      let doc = Feeds.findOne({});
      const docID = doc._id;
      fc.assert(
        // { description, picture, users, opportunity, course, academicTerm, retired }
        fc.property(fc.lorem(10), fc.lorem(1), fc.boolean(),
          (description, picture, retired) => {
            const users = makeSampleUserArray(2);
            const course = makeSampleCourse();
            const sponsor = makeSampleUser(ROLE.FACULTY);
            const opportunity = makeSampleOpportunity(sponsor);
            const academicTerm = makeSampleAcademicTermSlug();
            Feeds.update(docID, { description, picture, users, opportunity, course, academicTerm, retired });
            doc = Feeds.findDoc(docID);
            expect(doc.description).to.equal(description);
            expect(doc.picture).to.equal(picture);
            expect(doc.retired).to.equal(retired);
            expect(AcademicTerms.findSlugByID(doc.termID)).to.equal(academicTerm);
            expect(doc.courseID).to.equal(course);
            expect(doc.opportunityID).to.equal(opportunity);
          }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() { // Tests dumpOne and restoreOne
      const origDoc = Feeds.findOne({});
      let docID = origDoc._id;
      const dumpObject = Feeds.dumpOne(docID);
      Feeds.removeIt(docID);
      expect(Feeds.isDefined(docID)).to.be.false;
      docID = Feeds.restoreOne(dumpObject);
      expect(Feeds.isDefined(docID)).to.be.true;
      const doc = Feeds.findDoc(docID);
      expect(doc.retired).to.equal(origDoc.retired);
      expect(doc.userIDs).to.deep.equal(origDoc.userIDs);
    });

    it('Can checkIntegrity no errors', function test5() { // Tests checkIntegrity
      const problems = Feeds.checkIntegrity();
      expect(problems).to.have.lengthOf(0);
    });
  });
}
