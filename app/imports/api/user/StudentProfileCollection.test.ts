import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import moment from 'moment';
import { removeAllEntities } from '../base/BaseUtilities';
import { StudentProfiles } from './StudentProfileCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { makeSampleInterestArray, makeSampleInterestSlugArray } from '../interest/SampleInterests';
import { makeSampleCareerGoalSlugArray } from '../career/SampleCareerGoals';
import { FavoriteInterests } from '../favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../favorite/FavoriteCareerGoalCollection';
import { makeSampleAcademicPlan } from '../degree-plan/SampleAcademicPlans';
import { makeSampleAcademicTermSlug } from '../academic-term/SampleAcademicTerms';
import { makeSampleCourseSlugArray } from '../course/SampleCourses';
import { makeSampleOpportunitySlugArray } from '../opportunity/SampleOpportunities';
import { makeSampleUser } from './SampleUsers';
import { ROLE } from '../role/Role';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('StudentProfileCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) { // Test the define and removeIt methods
      this.timeout(150000);
      const sponsor = makeSampleUser(ROLE.FACULTY);
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(1), fc.lorem(1), fc.lorem(1), fc.boolean(),
          (firstName, lastName, picture, website, retired) => {
          const username = `${faker.internet.userName()}${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`;
            const interests = makeSampleInterestArray();
            const careerGoals = makeSampleCareerGoalSlugArray();
            const level = faker.random.number({ min: 1, max: 6 });
            const favoriteAcademicPlans = [makeSampleAcademicPlan()];
            const declaredAcademicTerm = makeSampleAcademicTermSlug();
            const favoriteCourses = makeSampleCourseSlugArray(2);
            const favoriteOpportunities = makeSampleOpportunitySlugArray(sponsor, 2);
            const docID = StudentProfiles.define({
              username, firstName, lastName, picture, website, interests,
              careerGoals, level, favoriteAcademicPlans, declaredAcademicTerm,
              favoriteCourses, favoriteOpportunities, retired,
            });
            expect(StudentProfiles.isDefined(docID)).to.be.true;
            expect(FavoriteInterests.count()).to.equal(interests.length);
            expect(FavoriteCareerGoals.count()).to.equal(careerGoals.length);
            const doc = StudentProfiles.findDoc(docID);
            expect(doc.username).to.equal(username);
            StudentProfiles.removeIt(docID);
            expect(StudentProfiles.isDefined(docID)).to.be.false;
            expect(FavoriteInterests.count()).to.equal(0);
            expect(FavoriteCareerGoals.count()).to.equal(0);
          }),
      );
      done();
    });

    it('Cannot define duplicates', function test2() { // Test if duplicate documents can be defined
      const username = faker.internet.userName();
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const picture = faker.image.imageUrl();
      const website = faker.internet.url();
      const interests = makeSampleInterestSlugArray();
      const careerGoals = makeSampleCareerGoalSlugArray();
      const level = faker.random.number({ min: 1, max: 6 });
      const declaredAcademicTerm = makeSampleAcademicTermSlug();
      const docID = StudentProfiles.define({
        username, firstName, lastName, picture, website, interests,
        careerGoals, level, declaredAcademicTerm,
      });
      expect(StudentProfiles.isDefined(docID)).to.be.true;
      expect(() => StudentProfiles.define({
        username, firstName, lastName, picture, website, interests,
        careerGoals, level, declaredAcademicTerm,
      })).to.throw(Error);
    });

    it('Can update', function test3(done) { // Test updating documents
      this.timeout(25000);
      let doc = StudentProfiles.findOne({});
      const docID = doc._id;
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(1), fc.lorem(1), fc.boolean(),
          fc.boolean(), fc.boolean(), fc.boolean(), fc.boolean(), fc.boolean(), fc.boolean(), fc.boolean(),
          fc.boolean(), fc.boolean(), fc.boolean(),
          (firstName, lastName, picture, isAlumni, retired, shareUsername, sharePicture, shareWebsite, shareInterests, shareCareerGoals, shareAcademicPlan, shareCourses, shareOpportunities, shareLevel) => {
          const website = faker.internet.url();
          const interests = makeSampleInterestArray(3);
          const careerGoals = makeSampleCareerGoalSlugArray(4);
          StudentProfiles.update(docID, {
            firstName,
            lastName,
            picture,
            website,
            interests,
            careerGoals,
            isAlumni, retired, shareUsername,
            sharePicture, shareWebsite, shareInterests, shareCareerGoals, shareAcademicPlan, shareCourses,
            shareOpportunities, shareLevel,
          });
          doc = StudentProfiles.findDoc(docID);
          expect(doc.firstName).to.equal(firstName);
          expect(doc.lastName).to.equal(lastName);
          expect(doc.picture).to.equal(picture);
          expect(doc.website).to.equal(website);
          // expect(FavoriteInterests.count()).to.equal(interests.length);
          // expect(FavoriteCareerGoals.count()).to.equal(careerGoals.length);
          expect(doc.retired).to.equal(retired);
          expect(doc.isAlumni).to.equal(isAlumni);
          expect(doc.shareUsername).to.equal(shareUsername);
          expect(doc.sharePicture).to.equal(sharePicture);
          expect(doc.shareWebsite).to.equal(shareWebsite);
          expect(doc.shareInterests).to.equal(shareInterests);
          expect(doc.shareCareerGoals).to.equal(shareCareerGoals);
          expect(doc.shareAcademicPlan).to.equal(shareAcademicPlan);
          expect(doc.shareCourses).to.equal(shareCourses);
          expect(doc.shareOpportunities).to.equal(shareOpportunities);
          expect(doc.shareLevel).to.equal(shareLevel);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() { // Tests dumpOne and restoreOne
      const origDoc = StudentProfiles.findOne({});
      let docID = origDoc._id;
      const dumpObject = StudentProfiles.dumpOne(docID);
      StudentProfiles.removeIt(docID);
      expect(StudentProfiles.isDefined(docID)).to.be.false;
      docID = StudentProfiles.restoreOne(dumpObject);
      expect(StudentProfiles.isDefined(docID)).to.be.true;
      const doc = StudentProfiles.findDoc(docID);
      expect(doc.firstName).to.equal(origDoc.firstName);
      expect(doc.lastName).to.equal(origDoc.lastName);
      expect(doc.picture).to.equal(origDoc.picture);
      expect(doc.website).to.equal(origDoc.website);
      expect(doc.interestIDs).to.deep.equal(origDoc.interestIDs);
      expect(doc.careerGoalIDs).to.deep.equal(origDoc.careerGoalIDs);
      expect(doc.retired).to.equal(origDoc.retired);
      expect(doc.isAlumni).to.equal(origDoc.isAlumni);
      expect(doc.shareUsername).to.equal(origDoc.shareUsername);
      expect(doc.sharePicture).to.equal(origDoc.sharePicture);
      expect(doc.shareWebsite).to.equal(origDoc.shareWebsite);
      expect(doc.shareInterests).to.equal(origDoc.shareInterests);
      expect(doc.shareCareerGoals).to.equal(origDoc.shareCareerGoals);
      expect(doc.shareAcademicPlan).to.equal(origDoc.shareAcademicPlan);
      expect(doc.shareCourses).to.equal(origDoc.shareCourses);
      expect(doc.shareOpportunities).to.equal(origDoc.shareOpportunities);
      expect(doc.shareLevel).to.equal(origDoc.shareLevel);
    });

    it('Can checkIntegrity no errors', function test5() { // Tests checkIntegrity
      const problems = StudentProfiles.checkIntegrity();
      expect(problems).to.have.lengthOf(0);
    });
  });
}
