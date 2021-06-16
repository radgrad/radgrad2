import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import { ProfileInterests } from './ProfileInterestCollection';
import { makeSampleInterest } from '../../interest/SampleInterests';
import { makeSampleUser } from '../SampleUsers';
import { removeAllEntities } from '../../base/BaseUtilities';
import { Slugs } from '../../slug/SlugCollection';
import { Interests } from '../../interest/InterestCollection';
import { Users } from '../UserCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('ProfileInterestCollection', function testSuite() {
    let interest;
    let interestName;
    let username;
    let userID;
    let firstName;

    before(function setup() {
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
      const docID = ProfileInterests.define({ interest, username });
      expect(ProfileInterests.isDefined(docID)).to.be.true;
      ProfileInterests.removeIt(docID);
      expect(ProfileInterests.isDefined(docID)).to.be.false;
    });

    it('Cannot define duplicates', function test2() {
      const docID1 = ProfileInterests.define({ interest, username });
      const docID2 = ProfileInterests.define({ interest, username });
      expect(docID1).to.equal(docID2);
      expect(ProfileInterests.isDefined(docID2)).to.be.true;
      ProfileInterests.removeIt(docID2);
      expect(ProfileInterests.isDefined(docID1)).to.be.false;
    });

    it('Can update', function test3(done) {
      const docID = ProfileInterests.define({ interest, username });
      fc.assert(
        fc.property(fc.boolean(), (retired) => {
          ProfileInterests.update(docID, { retired });
          const fav = ProfileInterests.findDoc(docID);
          expect(fav.retired).to.equal(retired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let fav = ProfileInterests.findOne({});
      let docID = fav._id;
      const dumpObject = ProfileInterests.dumpOne(docID);
      ProfileInterests.removeIt(docID);
      expect(ProfileInterests.isDefined(docID)).to.be.false;
      docID = ProfileInterests.restoreOne(dumpObject);
      expect(ProfileInterests.isDefined(docID)).to.be.true;
      fav = ProfileInterests.findDoc(docID);
      expect(fav.interestID).to.equal(interest);
      expect(fav.userID).to.equal(userID);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = ProfileInterests.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });

    it('Can get docs and slug', function test6() {
      const docID = ProfileInterests.define({ interest, username });
      const interestDoc = ProfileInterests.getInterestDoc(docID);
      expect(interestDoc).to.exist;
      expect(interestDoc.name).to.equal(interestName);
      const interestSlug = Slugs.getNameFromID(interestDoc.slugID);
      expect(ProfileInterests.getInterestSlug(docID)).to.equal(interestSlug);
      const studentDoc = ProfileInterests.getStudentDoc(docID);
      expect(studentDoc).to.exist;
      expect(studentDoc.firstName).to.equal(firstName);
      const studentUsername = ProfileInterests.getStudentUsername(docID);
      expect(studentUsername.startsWith('student')).to.be.true;
      expect(studentUsername).to.equal(username);
    });

    it('Can dumpUser', function test7() {
      username = makeSampleUser();
      const numToMake = 10;
      const existing = ProfileInterests.count();
      for (let i = 0; i < numToMake; i++) {
        interest = makeSampleInterest();
        ProfileInterests.define({ interest, username });
      }
      const profileCount = ProfileInterests.count();
      expect(profileCount).to.equal(existing + numToMake);
      const userDump = ProfileInterests.dumpUser(username);
      expect(userDump.length).to.equal(numToMake);
    });
  });
}
