import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import { ProfileOpportunities } from './ProfileOpportunityCollection';
import { makeSampleOpportunity } from '../../opportunity/SampleOpportunities';
import { makeSampleUser } from '../SampleUsers';
import { removeAllEntities } from '../../base/BaseUtilities';
import { Slugs } from '../../slug/SlugCollection';
import { ROLE } from '../../role/Role';
import { Users } from '../UserCollection';
import { Opportunities } from '../../opportunity/OpportunityCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('ProfileOpportunityCollection', function testSuite() {
    let opportunity;
    let opportunityName;
    let userID;
    let sponsor;
    let username;
    let firstName;

    before(function setup() {
      removeAllEntities();
      sponsor = makeSampleUser(ROLE.FACULTY);
      opportunity = makeSampleOpportunity(sponsor);
      opportunityName = Opportunities.findDoc(opportunity).name;
      userID = makeSampleUser();
      const profile = Users.getProfile(userID);
      username = profile.username;
      firstName = profile.firstName;
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1() {
      const docID = ProfileOpportunities.define({ opportunity, username });
      expect(ProfileOpportunities.isDefined(docID)).to.be.true;
      ProfileOpportunities.removeIt(docID);
      expect(ProfileOpportunities.isDefined(docID)).to.be.false;
    });

    it('Cannot define duplicates', function test2() {
      const docID1 = ProfileOpportunities.define({ opportunity, username });
      const docID2 = ProfileOpportunities.define({ opportunity, username });
      expect(docID1).to.equal(docID2);
      expect(ProfileOpportunities.isDefined(docID2)).to.be.true;
      ProfileOpportunities.removeIt(docID1);
      expect(ProfileOpportunities.isDefined(docID2)).to.be.false;
    });

    it('Can update', function test3(done) {
      const docID = ProfileOpportunities.define({ opportunity, username });
      fc.assert(
        fc.property(fc.boolean(), (retired) => {
          ProfileOpportunities.update(docID, { retired });
          const fav = ProfileOpportunities.findDoc(docID);
          expect(fav.retired).to.equal(retired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let fav = ProfileOpportunities.findOne({});
      let docID = fav._id;
      const dumpObject = ProfileOpportunities.dumpOne(docID);
      ProfileOpportunities.removeIt(docID);
      expect(ProfileOpportunities.isDefined(docID)).to.be.false;
      docID = ProfileOpportunities.restoreOne(dumpObject);
      expect(ProfileOpportunities.isDefined(docID)).to.be.true;
      fav = ProfileOpportunities.findDoc(docID);
      expect(fav.opportunityID).to.equal(opportunity);
      expect(fav.userID).to.equal(userID);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = ProfileOpportunities.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });

    it('Can get docs and slug', function test6() {
      const docID = ProfileOpportunities.define({ opportunity, username });
      const opportunityDoc = ProfileOpportunities.getOpportunityDoc(docID);
      expect(opportunityDoc).to.exist;
      expect(opportunityDoc.name).to.equal(opportunityName);
      expect(opportunityDoc.sponsorID).to.equal(sponsor);
      const opportunitySlug = Slugs.getNameFromID(opportunityDoc.slugID);
      expect(ProfileOpportunities.getOpportunitySlug(docID)).to.equal(opportunitySlug);
      const studentDoc = ProfileOpportunities.getStudentDoc(docID);
      expect(studentDoc).to.exist;
      expect(studentDoc.firstName).to.equal(firstName);
      const studentUsername = ProfileOpportunities.getStudentUsername(docID);
      expect(studentUsername.startsWith('student')).to.be.true;
      expect(studentUsername).to.equal(username);
    });

    it('Can dumpUser', function test7() {
      username = makeSampleUser();
      const numToMake = 10;
      const existing = ProfileOpportunities.count();
      for (let i = 0; i < numToMake; i++) {
        sponsor = makeSampleUser(ROLE.FACULTY);
        opportunity = makeSampleOpportunity(sponsor);
        ProfileOpportunities.define({ opportunity, username });
      }
      const profileCount = ProfileOpportunities.count();
      expect(profileCount).to.equal(existing + numToMake);
      const userDump = ProfileOpportunities.dumpUser(username);
      expect(userDump.length).to.equal(numToMake);
    });
  });
}
