import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { FavoriteInterests } from './FavoriteInterestCollection';
import { makeSampleInterest } from '../interest/SampleInterests';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { Slugs } from '../slug/SlugCollection';
import { Interests } from '../interest/InterestCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FavoriteInterestCollection', function testSuite() {
    let interest;
    let interestName;
    let username;


    before(function setup() {
      this.timeout(5000);
      removeAllEntities();
      interest = makeSampleInterest();
      interestName = Interests.findDoc(interest).name;
      username = makeSampleUser();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne, #update, #checkIntegrity', function test() {
      let docID = FavoriteInterests.define({ interest, username });
      expect(FavoriteInterests.isDefined(docID)).to.be.true;
      let problems = FavoriteInterests.checkIntegrity();
      expect(problems.length).to.equal(0);
      const dumpObject = FavoriteInterests.dumpOne(docID);
      FavoriteInterests.removeIt(docID);
      expect(FavoriteInterests.isDefined(docID)).to.be.false;
      docID = FavoriteInterests.restoreOne(dumpObject);
      problems = FavoriteInterests.checkIntegrity();
      expect(problems.length).to.equal(0);
      expect(FavoriteInterests.isDefined(docID)).to.be.true;
      expect(FavoriteInterests.countNonRetired()).to.equal(1);
      FavoriteInterests.update(docID, { retired: true });
      expect(FavoriteInterests.countNonRetired()).to.equal(0);
      FavoriteInterests.removeIt(docID);
    });

    it('#getInterestDoc, #getInterestSlug, #getStudentDoc, #getStudentUsername', function test() {
      const docID = FavoriteInterests.define({ interest, username });
      const interestDoc = FavoriteInterests.getInterestDoc(docID);
      expect(interestDoc).to.exist;
      expect(interestDoc.name).to.equal(interestName);
      const interestSlug = Slugs.getNameFromID(interestDoc.slugID);
      expect(FavoriteInterests.getInterestSlug(docID)).to.equal(interestSlug);
      const studentDoc = FavoriteInterests.getStudentDoc(docID);
      expect(studentDoc).to.exist;
      expect(studentDoc.firstName).to.equal('Amy');
      const studentUsername = FavoriteInterests.getStudentUsername(docID);
      expect(studentUsername.startsWith('student')).to.be.true;
      expect(studentUsername.endsWith('@hawaii.edu')).to.be.true;
    });
  });
}
