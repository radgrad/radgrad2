import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import { FavoriteCareerGoals } from './FavoriteCareerGoalCollection';
import { makeSampleCareerGoal } from '../career/SampleCareerGoals';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { Slugs } from '../slug/SlugCollection';
import { Users } from '../user/UserCollection';
import { CareerGoals } from '../career/CareerGoalCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FavoriteCareerGoalCollection', function testSuite() {
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
      const docID = FavoriteCareerGoals.define({ careerGoal, username });
      expect(FavoriteCareerGoals.isDefined(docID)).to.be.true;
      FavoriteCareerGoals.removeIt(docID);
      expect(FavoriteCareerGoals.isDefined(docID)).to.be.false;
    });

    it('Cannot define duplicates', function test2() {
      const docID1 = FavoriteCareerGoals.define({ careerGoal, username });
      const docID2 = FavoriteCareerGoals.define({ careerGoal, username });
      expect(docID1).to.equal(docID2);
      expect(FavoriteCareerGoals.isDefined(docID2)).to.be.true;
      FavoriteCareerGoals.removeIt(docID1);
      expect(FavoriteCareerGoals.isDefined(docID2)).to.be.false;
    });

    it('Can update', function test3(done) {
      this.timeout(5000);
      const docID = FavoriteCareerGoals.define({ careerGoal, username });
      fc.assert(
        fc.property(fc.boolean(), (retired) => {
          FavoriteCareerGoals.update(docID, { retired });
          const fav = FavoriteCareerGoals.findDoc(docID);
          expect(fav.retired).to.equal(retired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let fav = FavoriteCareerGoals.findOne({});
      let docID = fav._id;
      const dumpObject = FavoriteCareerGoals.dumpOne(docID);
      FavoriteCareerGoals.removeIt(docID);
      expect(FavoriteCareerGoals.isDefined(docID)).to.be.false;
      docID = FavoriteCareerGoals.restoreOne(dumpObject);
      fav = FavoriteCareerGoals.findDoc(docID);
      expect(fav.userID).to.equal(userID);
      expect(fav.careerGoalID).to.equal(careerGoal);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = FavoriteCareerGoals.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });

    it('Can get docs and slug', function test6() {
      const docID = FavoriteCareerGoals.define({ careerGoal, username });
      const careerGoalDoc = FavoriteCareerGoals.getCareerGoalDoc(docID);
      expect(careerGoalDoc).to.exist;
      expect(careerGoalDoc.name).to.equal(careerGoalName);
      const careerGoalSlug = Slugs.getNameFromID(careerGoalDoc.slugID);
      expect(FavoriteCareerGoals.getCareerGoalSlug(docID)).to.equal(careerGoalSlug);
      const studentDoc = FavoriteCareerGoals.getStudentDoc(docID);
      expect(studentDoc).to.exist;
      expect(studentDoc.firstName).to.equal(firstName);
      const studentUsername = FavoriteCareerGoals.getStudentUsername(docID);
      expect(studentUsername.startsWith('student')).to.be.true;
      expect(studentUsername).to.equal(username);
    });
  });
}
