import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import { FavoriteInterests } from './FavoriteInterestCollection';
import { makeSampleInterest } from '../interest/SampleInterests';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { Slugs } from '../slug/SlugCollection';
import { Interests } from '../interest/InterestCollection';
import { Users } from '../user/UserCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FavoriteInterestCollection', function testSuite() {
    let interest;
    let interestName;
    let username;
    let userID;
    let firstName;


    before(function setup() {
      this.timeout(5000);
      removeAllEntities();
      interest = makeSampleInterest();
      interestName = Interests.findDoc(interest).name;
      userID = makeSampleUser();
      const profile = Users.getProfile(userID);
      username = profile.username;
      firstName = profile.firstName;
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1() {
      const docID = FavoriteInterests.define({ interest, username });
      expect(FavoriteInterests.isDefined(docID)).to.be.true;
      FavoriteInterests.removeIt(docID);
      expect(FavoriteInterests.isDefined(docID)).to.be.false;
    });

    it('Cannot define duplicates', function test2() {
      const docID1 = FavoriteInterests.define({ interest, username });
      const docID2 = FavoriteInterests.define({ interest, username });
      expect(docID1).to.equal(docID2);
      expect(FavoriteInterests.isDefined(docID2)).to.be.true;
      FavoriteInterests.removeIt(docID2);
      expect(FavoriteInterests.isDefined(docID1)).to.be.false;
    });

    it('Can update', function test3(done) {
      this.timeout(5000);
      const docID = FavoriteInterests.define({ interest, username });
      fc.assert(
        fc.property(fc.boolean(), (retired) => {
          FavoriteInterests.update(docID, { retired });
          const fav = FavoriteInterests.findDoc(docID);
          expect(fav.retired).to.equal(retired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let fav = FavoriteInterests.findOne({});
      let docID = fav._id;
      const dumpObject = FavoriteInterests.dumpOne(docID);
      FavoriteInterests.removeIt(docID);
      expect(FavoriteInterests.isDefined(docID)).to.be.false;
      docID = FavoriteInterests.restoreOne(dumpObject);
      expect(FavoriteInterests.isDefined(docID)).to.be.true;
      fav = FavoriteInterests.findDoc(docID);
      expect(fav.interestID).to.equal(interest);
      expect(fav.userID).to.equal(userID);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = FavoriteInterests.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });

    it('Can get docs and slug', function test6() {
      const docID = FavoriteInterests.define({ interest, username });
      const interestDoc = FavoriteInterests.getInterestDoc(docID);
      expect(interestDoc).to.exist;
      expect(interestDoc.name).to.equal(interestName);
      const interestSlug = Slugs.getNameFromID(interestDoc.slugID);
      expect(FavoriteInterests.getInterestSlug(docID)).to.equal(interestSlug);
      const studentDoc = FavoriteInterests.getStudentDoc(docID);
      expect(studentDoc).to.exist;
      expect(studentDoc.firstName).to.equal(firstName);
      const studentUsername = FavoriteInterests.getStudentUsername(docID);
      expect(studentUsername.startsWith('student')).to.be.true;
      expect(studentUsername).to.equal(username);
    });
  });
}
