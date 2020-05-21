import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import { removeAllEntities } from '../base/BaseUtilities';
import { MentorProfiles } from './MentorProfileCollection';
import { makeSampleInterestArray, makeSampleInterestSlugArray } from '../interest/SampleInterests';
import { makeSampleCareerGoalSlugArray } from '../career/SampleCareerGoals';
import { FavoriteInterests } from '../favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../favorite/FavoriteCareerGoalCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('MentorProfileCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) { // Test the define and removeIt methods
      this.timeout(25000);
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(1), fc.lorem(1), fc.lorem(1), fc.lorem(1), fc.lorem(3), fc.lorem(2), fc.lorem(2), fc.lorem(1), fc.lorem(10),
          (username, firstName, lastName, picture, website, company, career, location, linkedin, motivation) => {
            const interests = makeSampleInterestArray();
            const careerGoals = makeSampleCareerGoalSlugArray();
            const docID = MentorProfiles.define({
              username, firstName, lastName, picture, website, interests,
              careerGoals, company, career, location, linkedin, motivation,
            });
            expect(MentorProfiles.isDefined(docID)).to.be.true;
            expect(FavoriteInterests.count()).to.equal(interests.length);
            expect(FavoriteCareerGoals.count()).to.equal(careerGoals.length);
            MentorProfiles.removeIt(docID);
            expect(MentorProfiles.isDefined(docID)).to.be.false;
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
      const company = faker.company.companyName();
      const location = `${faker.address.county()}, ${faker.address.state()}`;
      const career = faker.name.jobTitle();
      const linkedin = faker.internet.userName();
      const motivation = faker.lorem.paragraph();
      const docID = MentorProfiles.define({
        username, firstName, lastName, picture, website, interests,
        careerGoals, company, career, location, linkedin, motivation,
      });
      expect(MentorProfiles.isDefined(docID)).to.be.true;
      expect(() => MentorProfiles.define({
        username, firstName, lastName, picture, website, interests,
        careerGoals, company, career, location, linkedin, motivation,
      })).to.throw(Error);
    });

    it('Can update', function test3(done) { // Test updating documents
      this.timeout(25000);
      let doc = MentorProfiles.findOne({});
      const docID = doc._id;
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(1), fc.lorem(1), fc.boolean(), (firstName, lastName, picture, retired) => {
          const website = faker.internet.url();
          const interests = makeSampleInterestArray(3);
          const careerGoals = makeSampleCareerGoalSlugArray(4);
          const company = faker.company.companyName();
          const location = `${faker.address.county()}, ${faker.address.state()}`;
          const career = faker.name.jobTitle();
          const linkedin = faker.internet.userName();
          const motivation = faker.lorem.paragraph();
          MentorProfiles.update(docID, {
            firstName,
            lastName,
            picture,
            website,
            interests,
            careerGoals,
            retired,
            company,
            location,
            career,
            linkedin,
            motivation,
          });
          doc = MentorProfiles.findDoc(docID);
          expect(doc.firstName).to.equal(firstName);
          expect(doc.lastName).to.equal(lastName);
          expect(doc.picture).to.equal(picture);
          expect(doc.website).to.equal(website);
          expect(FavoriteInterests.count()).to.equal(interests.length);
          expect(FavoriteCareerGoals.count()).to.equal(careerGoals.length);
          expect(doc.retired).to.equal(retired);
          expect(doc.company).to.equal(company);
          expect(doc.location).to.equal(location);
          expect(doc.career).to.equal(career);
          expect(doc.linkedin).to.equal(linkedin);
          expect(doc.motivation).to.equal(motivation);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() { // Tests dumpOne and restoreOne
      const origDoc = MentorProfiles.findOne({});
      let docID = origDoc._id;
      const dumpObject = MentorProfiles.dumpOne(docID);
      MentorProfiles.removeIt(docID);
      expect(MentorProfiles.isDefined(docID)).to.be.false;
      docID = MentorProfiles.restoreOne(dumpObject);
      expect(MentorProfiles.isDefined(docID)).to.be.true;
      const doc = MentorProfiles.findDoc(docID);
      expect(doc.firstName).to.equal(origDoc.firstName);
      expect(doc.lastName).to.equal(origDoc.lastName);
      expect(doc.picture).to.equal(origDoc.picture);
      expect(doc.website).to.equal(origDoc.website);
      expect(doc.interestIDs).to.deep.equal(origDoc.interestIDs);
      expect(doc.careerGoalIDs).to.deep.equal(origDoc.careerGoalIDs);
      expect(doc.retired).to.equal(origDoc.retired);
      expect(doc.company).to.equal(origDoc.company);
      expect(doc.location).to.equal(origDoc.location);
      expect(doc.career).to.equal(origDoc.career);
      expect(doc.linkedin).to.equal(origDoc.linkedin);
      expect(doc.motivation).to.equal(origDoc.motivation);
    });

    it('Can checkIntegrity no errors', function test5() { // Tests checkIntegrity
      const problems = MentorProfiles.checkIntegrity();
      expect(problems).to.have.lengthOf(0);
    });
  });
}
