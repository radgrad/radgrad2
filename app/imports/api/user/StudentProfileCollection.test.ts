import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import moment from 'moment';
import { removeAllEntities } from '../base/BaseUtilities';
import { StudentProfiles } from './StudentProfileCollection';
import { makeSampleInterestArray, makeSampleInterestSlugArray } from '../interest/SampleInterests';
import { makeSampleCareerGoalSlugArray } from '../career/SampleCareerGoals';
import { ProfileInterests } from './profile-entries/ProfileInterestCollection';
import { ProfileCareerGoals } from './profile-entries/ProfileCareerGoalCollection';
import { makeSampleAcademicTermSlug } from '../academic-term/SampleAcademicTerms';
import { makeSampleCourseSlugArray } from '../course/SampleCourses';
import { makeSampleOpportunitySlugArray } from '../opportunity/SampleOpportunities';
import { makeSampleUser } from './SampleUsers';
import { ROLE } from '../role/Role';

// Technical Debt: need to check the last* fields of the student profile. We are not testing them.

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
      const sponsor = makeSampleUser(ROLE.FACULTY);
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(1), fc.lorem(1), fc.lorem(1), fc.boolean(),
          (firstName, lastName, picture, website, retired) => {
            const username = `${faker.internet.userName()}${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`;
            const interests = makeSampleInterestArray();
            const careerGoals = makeSampleCareerGoalSlugArray();
            const level = faker.random.number({ min: 1, max: 6 });
            const declaredAcademicTerm = makeSampleAcademicTermSlug();
            const profileCourses = makeSampleCourseSlugArray(2);
            const profileOpportunities = makeSampleOpportunitySlugArray(sponsor, 2);
            const docID = StudentProfiles.define({
              username, firstName, lastName, picture, website, interests,
              careerGoals, level, declaredAcademicTerm,
              profileCourses, profileOpportunities, retired,
            });
            expect(StudentProfiles.isDefined(docID)).to.be.true;
            expect(ProfileInterests.count()).to.equal(interests.length);
            expect(ProfileCareerGoals.count()).to.equal(careerGoals.length);
            const doc = StudentProfiles.findDoc(docID);
            expect(doc.username).to.equal(username);
            StudentProfiles.removeIt(docID);
            expect(StudentProfiles.isDefined(docID)).to.be.false;
            expect(ProfileInterests.count()).to.equal(0);
            expect(ProfileCareerGoals.count()).to.equal(0);
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
      let doc = StudentProfiles.findOne({});
      const docID = doc._id;
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(1), fc.lorem(1), fc.boolean(),
          fc.boolean(), fc.boolean(), fc.boolean(), fc.boolean(), fc.boolean(), fc.boolean(), fc.boolean(),
          fc.boolean(), fc.boolean(),
          (firstName, lastName, picture, isAlumni, retired,  sharePicture, shareWebsite, shareInterests, shareCareerGoals, shareCourses, shareOpportunities, shareLevel, shareICE) => {
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
              isAlumni, retired, sharePicture, shareWebsite, shareInterests, shareCareerGoals, shareCourses,
              shareOpportunities, shareLevel, shareICE,
            });
            doc = StudentProfiles.findDoc(docID);
            expect(doc.firstName).to.equal(firstName);
            expect(doc.lastName).to.equal(lastName);
            expect(doc.picture).to.equal(picture);
            expect(doc.website).to.equal(website);
            // expect(ProfileInterests.count()).to.equal(interests.length);
            // expect(ProfileCareerGoals.count()).to.equal(careerGoals.length);
            expect(doc.retired).to.equal(retired);
            expect(doc.isAlumni).to.equal(isAlumni);
            expect(doc.sharePicture).to.equal(sharePicture);
            expect(doc.shareWebsite).to.equal(shareWebsite);
            expect(doc.shareInterests).to.equal(shareInterests);
            expect(doc.shareCareerGoals).to.equal(shareCareerGoals);
            expect(doc.shareCourses).to.equal(shareCourses);
            expect(doc.shareOpportunities).to.equal(shareOpportunities);
            expect(doc.shareLevel).to.equal(shareLevel);
            expect(doc.shareICE).to.equal(shareICE);
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
      expect(doc.retired).to.equal(origDoc.retired);
      expect(doc.isAlumni).to.equal(origDoc.isAlumni);
      expect(doc.sharePicture).to.equal(origDoc.sharePicture);
      expect(doc.shareWebsite).to.equal(origDoc.shareWebsite);
      expect(doc.shareInterests).to.equal(origDoc.shareInterests);
      expect(doc.shareCareerGoals).to.equal(origDoc.shareCareerGoals);
      expect(doc.shareCourses).to.equal(origDoc.shareCourses);
      expect(doc.shareOpportunities).to.equal(origDoc.shareOpportunities);
      expect(doc.shareLevel).to.equal(origDoc.shareLevel);
      expect(doc.shareICE).to.equal(origDoc.shareICE);
    });

    it('Can checkIntegrity no errors', function test5() { // Tests checkIntegrity
      const problems = StudentProfiles.checkIntegrity();
      expect(problems).to.have.lengthOf(0);
    });
  });
}
