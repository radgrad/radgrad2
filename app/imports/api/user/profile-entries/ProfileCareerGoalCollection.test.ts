import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import { ProfileCareerGoals } from './ProfileCareerGoalCollection';
import { makeSampleCareerGoal } from '../../career/SampleCareerGoals';
import { makeSampleUser } from '../SampleUsers';
import { removeAllEntities } from '../../base/BaseUtilities';
import { Slugs } from '../../slug/SlugCollection';
import { Users } from '../UserCollection';
import { CareerGoals } from '../../career/CareerGoalCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('ProfileCareerGoalCollection', function testSuite() {
    let careerGoal;
    let userID;
    let username;
    let firstName;
    let careerGoalName;

    before(function setup() {
      removeAllEntities();
      careerGoal = makeSampleCareerGoal();
      careerGoalName = CareerGoals.findDoc(careerGoal).name;
      userID = makeSampleUser();
      const profile = Users.getProfile(userID);
      username = profile.username;
      firstName = profile.firstName;
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1() {
      const docID = ProfileCareerGoals.define({ careerGoal, username });
      expect(ProfileCareerGoals.isDefined(docID)).to.be.true;
      ProfileCareerGoals.removeIt(docID);
      expect(ProfileCareerGoals.isDefined(docID)).to.be.false;
    });

    it('Cannot define duplicates', function test2() {
      const docID1 = ProfileCareerGoals.define({ careerGoal, username });
      const docID2 = ProfileCareerGoals.define({ careerGoal, username });
      expect(docID1).to.equal(docID2);
      expect(ProfileCareerGoals.isDefined(docID2)).to.be.true;
      ProfileCareerGoals.removeIt(docID1);
      expect(ProfileCareerGoals.isDefined(docID2)).to.be.false;
    });

    it('Can update', function test3(done) {
      const docID = ProfileCareerGoals.define({ careerGoal, username });
      fc.assert(
        fc.property(fc.boolean(), (retired) => {
          ProfileCareerGoals.update(docID, { retired });
          const fav = ProfileCareerGoals.findDoc(docID);
          expect(fav.retired).to.equal(retired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let fav = ProfileCareerGoals.findOne({});
      let docID = fav._id;
      const dumpObject = ProfileCareerGoals.dumpOne(docID);
      ProfileCareerGoals.removeIt(docID);
      expect(ProfileCareerGoals.isDefined(docID)).to.be.false;
      docID = ProfileCareerGoals.restoreOne(dumpObject);
      fav = ProfileCareerGoals.findDoc(docID);
      expect(fav.userID).to.equal(userID);
      expect(fav.careerGoalID).to.equal(careerGoal);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = ProfileCareerGoals.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });

    it('Can get docs and slug', function test6() {
      const docID = ProfileCareerGoals.define({ careerGoal, username });
      const careerGoalDoc = ProfileCareerGoals.getCareerGoalDoc(docID);
      expect(careerGoalDoc).to.exist;
      expect(careerGoalDoc.name).to.equal(careerGoalName);
      const careerGoalSlug = Slugs.getNameFromID(careerGoalDoc.slugID);
      expect(ProfileCareerGoals.getCareerGoalSlug(docID)).to.equal(careerGoalSlug);
      const studentDoc = ProfileCareerGoals.getStudentDoc(docID);
      expect(studentDoc).to.exist;
      expect(studentDoc.firstName).to.equal(firstName);
      const studentUsername = ProfileCareerGoals.getStudentUsername(docID);
      expect(studentUsername.startsWith('student')).to.be.true;
      expect(studentUsername).to.equal(username);
    });

    it('Can dumpUser', function test7() {
      username = makeSampleUser();
      const numToMake = 10;
      const existingProfile = ProfileCareerGoals.count();
      for (let i = 0; i < numToMake; i++) {
        careerGoal = makeSampleCareerGoal();
        ProfileCareerGoals.define({ careerGoal, username });
      }
      const profileCount = ProfileCareerGoals.count();
      expect(profileCount).to.equal(existingProfile + numToMake);
      const dumpUser = ProfileCareerGoals.dumpUser(username);
      expect(dumpUser.length).to.equal(numToMake);
    });
  });
}
