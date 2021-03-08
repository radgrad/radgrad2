import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import { removeAllEntities } from '../base/BaseUtilities';
import { AdvisorProfiles } from './AdvisorProfileCollection';
import { makeSampleInterestArray, makeSampleInterestSlugArray } from '../interest/SampleInterests';
import { makeSampleCareerGoalSlugArray } from '../career/SampleCareerGoals';
import { ProfileInterests } from './profile-entries/ProfileInterestCollection';
import { ProfileCareerGoals } from './profile-entries/ProfileCareerGoalCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('AdvisorProfileCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) { // Test the define and removeIt methods
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(1), fc.lorem(1), fc.lorem(1), fc.lorem(1), (username, firstName, lastName, picture, website) => {
          const interests = makeSampleInterestArray();
          const careerGoals = makeSampleCareerGoalSlugArray();
          const docID = AdvisorProfiles.define({ username, firstName, lastName, picture, website, interests, careerGoals });
          expect(AdvisorProfiles.isDefined(docID)).to.be.true;
          expect(ProfileInterests.count()).to.equal(interests.length);
          expect(ProfileCareerGoals.count()).to.equal(careerGoals.length);
          AdvisorProfiles.removeIt(docID);
          expect(AdvisorProfiles.isDefined(docID)).to.be.false;
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
      const docID = AdvisorProfiles.define({ username, firstName, lastName, picture, website, interests, careerGoals });
      expect(AdvisorProfiles.isDefined(docID)).to.be.true;
      expect(() => AdvisorProfiles.define({ username, firstName, lastName, picture, website, interests, careerGoals })).to.throw(Error);
    });

    it('Can update', function test3(done) { // Test updating documents
      let doc = AdvisorProfiles.findOne({});
      const docID = doc._id;
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(1), fc.lorem(1), fc.boolean(), (firstName, lastName, picture, retired) => {
          const website = faker.internet.url();
          const interests = makeSampleInterestArray();
          const careerGoals = makeSampleCareerGoalSlugArray();
          AdvisorProfiles.update(docID, { firstName, lastName, picture, retired, website, interests, careerGoals });
          doc = AdvisorProfiles.findDoc(docID);
          expect(doc.firstName).to.equal(firstName);
          expect(doc.lastName).to.equal(lastName);
          expect(doc.picture).to.equal(picture);
          expect(doc.website).to.equal(website);
          expect(ProfileInterests.count()).to.equal(interests.length);
          expect(ProfileCareerGoals.count()).to.equal(careerGoals.length);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() { // Tests dumpOne and restoreOne
      const origDoc = AdvisorProfiles.findOne({});
      let docID = origDoc._id;
      const dumpObject = AdvisorProfiles.dumpOne(docID);
      AdvisorProfiles.removeIt(docID);
      expect(AdvisorProfiles.isDefined(docID)).to.be.false;
      expect(ProfileInterests.count()).to.equal(0);
      expect(ProfileCareerGoals.count()).to.equal(0);
      docID = AdvisorProfiles.restoreOne(dumpObject);
      expect(AdvisorProfiles.isDefined(docID)).to.be.true;
      const doc = AdvisorProfiles.findDoc(docID);
      expect(doc.firstName).to.equal(origDoc.firstName);
      expect(doc.lastName).to.equal(origDoc.lastName);
      expect(doc.picture).to.equal(origDoc.picture);
      expect(doc.website).to.equal(origDoc.website);
    });

    it('Can checkIntegrity no errors', function test5() { // Tests checkIntegrity
      const problems = AdvisorProfiles.checkIntegrity();
      expect(problems).to.have.lengthOf(0);
    });
  });
}
