import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import { ROLE } from '../role/Role';
import { VerificationRequests } from './VerificationRequestCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { makeSampleOpportunityInstance } from '../opportunity/SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';
import { Users } from '../user/UserCollection';
import { Slugs } from '../slug/SlugCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('VerificationRequestCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) { // Test the define and removeIt methods
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(5), (fcWord, documentation) => {
          const sponsorID = makeSampleUser(ROLE.FACULTY);
          const sponsor = Users.getProfile(sponsorID).username;
          const studentID = makeSampleUser();
          const student = Users.getProfile(studentID).username;
          const oiID = makeSampleOpportunityInstance(student, sponsor);
          const opportunityDoc = OpportunityInstances.getOpportunityDoc(oiID);
          const opportunity = Slugs.getNameFromID(opportunityDoc.slugID);
          const academicTermDoc = OpportunityInstances.getAcademicTermDoc(oiID);
          const academicTerm = Slugs.getNameFromID(academicTermDoc.slugID);
          // console.log(oiDoc, opportunityDoc, academicTermDoc);
          // console.log(sponsor, student, opportunity, academicTerm);
          // define without opportunity instance
          const docID = VerificationRequests.define({ student, academicTerm, opportunity, documentation });
          expect(VerificationRequests.isDefined(docID)).to.be.true;
          VerificationRequests.removeIt(docID);
          expect(VerificationRequests.isDefined(docID)).to.be.false;
          const docID2 = VerificationRequests.define({ student, opportunityInstance: oiID, documentation });
          expect(VerificationRequests.isDefined(docID2)).to.be.true;
          VerificationRequests.removeIt(docID2);
          expect(VerificationRequests.isDefined(docID2)).to.be.false;
        }),
      );
      done();
    });

    it('Can define duplicates', function test2() { // Test if duplicate documents can be defined
      const sponsorID = makeSampleUser(ROLE.FACULTY);
      const sponsor = Users.getProfile(sponsorID).username;
      const studentID = makeSampleUser();
      const student = Users.getProfile(studentID).username;
      const oiID = makeSampleOpportunityInstance(student, sponsor);
      const documentation = faker.lorem.sentence();
      const docID = VerificationRequests.define({ student, opportunityInstance: oiID, documentation });
      const docID2 = VerificationRequests.define({ student, opportunityInstance: oiID, documentation });
      expect(docID).to.not.equal(docID2);
      VerificationRequests.removeIt(docID2);
    });

    it('Can update', function test3(done) { // Test updating documents
      let doc = VerificationRequests.findOne({});
      const docID = doc._id;
      fc.assert(
        fc.property(fc.boolean(), (fcRetired) => {
          const rand = faker.random.number({ min: 0, max: 2 });
          let status;
          switch (rand) {
            case 0:
              status = VerificationRequests.ACCEPTED;
              break;
            case 1:
              status = VerificationRequests.OPEN;
              break;
            default:
              status = VerificationRequests.REJECTED;
          }
          VerificationRequests.update(docID, { status, retired: fcRetired });
          doc = VerificationRequests.findDoc(docID);
          expect(doc.status).to.equal(status);
          expect(doc.retired).to.equal(fcRetired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() { // Tests dumpOne and restoreOne
      const origDoc = VerificationRequests.findOne({});
      let docID = origDoc._id;
      const dumpObject = VerificationRequests.dumpOne(docID);
      VerificationRequests.removeIt(docID);
      expect(VerificationRequests.isDefined(docID)).to.be.false;
      docID = VerificationRequests.restoreOne(dumpObject);
      expect(VerificationRequests.isDefined(docID)).to.be.true;
    });

    it('Can checkIntegrity no errors', function test5() { // Tests checkIntegrity
      const problems = VerificationRequests.checkIntegrity();
      expect(problems).to.have.lengthOf(0);
    });

    it('Can get documents from VR', function test6() {
      const origDoc = VerificationRequests.findOne({});
      const docID = origDoc._id;
      const opportunityDoc = VerificationRequests.getOpportunityDoc(docID);
      expect(opportunityDoc).to.exist;
      const studentDoc = VerificationRequests.getStudentDoc(docID);
      expect(studentDoc).to.exist;
      const sponsorDoc = VerificationRequests.getSponsorDoc(docID);
      expect(sponsorDoc).to.exist;
      const opportunityInstanceDoc = VerificationRequests.getOpportunityInstanceDoc(docID);
      expect(opportunityInstanceDoc).to.exist;
      expect(opportunityInstanceDoc.studentID).to.equal(studentDoc.userID);
      expect(opportunityDoc.sponsorID).to.equal(sponsorDoc.userID);
      expect(opportunityInstanceDoc.opportunityID).to.equal(opportunityDoc._id);
    });

    it('Can dumpUser', function test7() {
      const numToMake = 10;
      const existingCount = VerificationRequests.count();
      const student: string = makeSampleUser();
      for (let i = 0; i < numToMake; i++) {
        const sponsor = makeSampleUser(ROLE.FACULTY);
        const oiID = makeSampleOpportunityInstance(student, sponsor);
        const documentation = faker.lorem.sentence();
        VerificationRequests.define({ student, opportunityInstance: oiID, documentation });
      }
      const vrCount = VerificationRequests.count();
      expect(vrCount).to.equal(existingCount + numToMake);
      const userDump = VerificationRequests.dumpUser(student);
      expect(userDump.length).to.equal(numToMake);
    });
  });
}
