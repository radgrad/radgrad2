import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import { FavoriteOpportunities } from './FavoriteOpportunityCollection';
import { makeSampleOpportunity } from '../opportunity/SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { Slugs } from '../slug/SlugCollection';
import { ROLE } from '../role/Role';
import { Users } from '../user/UserCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FavoriteOpportunityCollection', function testSuite() {
    let opportunity;
    let opportunityName;
    let student;
    let sponsor;
    let username;
    let firstName;

    before(function setup() {
      this.timeout(50000);
      removeAllEntities();
      sponsor = makeSampleUser(ROLE.FACULTY);
      opportunity = makeSampleOpportunity(sponsor);
      opportunityName = Opportunities.findDoc(opportunity).name;
      student = makeSampleUser();
      const profile = Users.getProfile(student);
      username = profile.username;
      firstName = profile.firstName;
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1() {
      const docID = FavoriteOpportunities.define({ opportunity, student });
      expect(FavoriteOpportunities.isDefined(docID)).to.be.true;
      FavoriteOpportunities.removeIt(docID);
      expect(FavoriteOpportunities.isDefined(docID)).to.be.false;
    });

    it('Cannot define duplicates', function test2() {
      const docID1 = FavoriteOpportunities.define({ opportunity, student });
      const docID2 = FavoriteOpportunities.define({ opportunity, student });
      expect(docID1).to.equal(docID2);
      expect(FavoriteOpportunities.isDefined(docID2)).to.be.true;
      FavoriteOpportunities.removeIt(docID1);
      expect(FavoriteOpportunities.isDefined(docID2)).to.be.false;
    });

    it('Can update', function test3(done) {
      this.timeout(50000);
      const docID = FavoriteOpportunities.define({ opportunity, student });
      fc.assert(
        fc.property(fc.boolean(), (retired) => {
          FavoriteOpportunities.update(docID, { retired });
          const fav = FavoriteOpportunities.findDoc(docID);
          expect(fav.retired).to.equal(retired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let fav = FavoriteOpportunities.findOne({});
      let docID = fav._id;
      const dumpObject = FavoriteOpportunities.dumpOne(docID);
      FavoriteOpportunities.removeIt(docID);
      expect(FavoriteOpportunities.isDefined(docID)).to.be.false;
      docID = FavoriteOpportunities.restoreOne(dumpObject);
      expect(FavoriteOpportunities.isDefined(docID)).to.be.true;
      fav = FavoriteOpportunities.findDoc(docID);
      expect(fav.opportunityID).to.equal(opportunity);
      expect(fav.studentID).to.equal(student);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = FavoriteOpportunities.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });

    it('Can get docs and slug', function test6() {
      const docID = FavoriteOpportunities.define({ opportunity, student });
      const opportunityDoc = FavoriteOpportunities.getOpportunityDoc(docID);
      expect(opportunityDoc).to.exist;
      expect(opportunityDoc.name).to.equal(opportunityName);
      expect(opportunityDoc.sponsorID).to.equal(sponsor);
      const opportunitySlug = Slugs.getNameFromID(opportunityDoc.slugID);
      expect(FavoriteOpportunities.getOpportunitySlug(docID)).to.equal(opportunitySlug);
      const studentDoc = FavoriteOpportunities.getStudentDoc(docID);
      expect(studentDoc).to.exist;
      expect(studentDoc.firstName).to.equal(firstName);
      const studentUsername = FavoriteOpportunities.getStudentUsername(docID);
      expect(studentUsername.startsWith('student')).to.be.true;
      expect(studentUsername).to.equal(username);
    });
  });
}
