import { Meteor } from 'meteor/meteor';
import {} from 'mocha';
import { expect } from 'chai';
import { ROLE } from '../role/Role';
import { VerificationRequests } from './VerificationRequestCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { makeSampleOpportunity } from '../opportunity/SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';
import { Users } from '../user/UserCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('VerificationRequestCollection', function testSuite() {
    let academicTerm;
    let student;
    let studentFirstName;
    let faculty;
    let facultyFirstName;
    let opportunityInstance;
    let opportunity;
    const verified = false;
    let docID;
    before(function setup() {
      removeAllEntities();
      academicTerm = AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2015 });
      AcademicTerms.define({ term: AcademicTerms.FALL, year: 2015 });
      student = makeSampleUser();
      studentFirstName = Users.getProfile(student).firstName;
      faculty = makeSampleUser(ROLE.FACULTY);
      console.log(Users.getProfile(student), Users.getProfile(faculty));
      facultyFirstName = Users.getProfile(faculty).firstName;
      opportunity = makeSampleOpportunity(makeSampleUser(ROLE.FACULTY));
      // opportunityInstance = OpportunityInstances.define({ academicTerm, opportunity, sponsor: faculty, student, verified });
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define without opportunity instance', function test() {
      try {
        VerificationRequests.define({ student, academicTerm, opportunity });
        expect.fail('Should throw Meteor.Error');
      } catch (e) {
        // this is what is supposed to happen.
      }
    });

    it('#define with opportunity instance using student, academicTerm and opportunity', function test() {
      opportunityInstance = OpportunityInstances.define({ academicTerm, opportunity, sponsor: faculty, student, verified });
      docID = VerificationRequests.define({ student, academicTerm, opportunity });
      expect(VerificationRequests.isDefined(docID)).to.be.true;
    });

    it('get documents', function test() {
      const opportunityDoc = VerificationRequests.getOpportunityDoc(docID);
      expect(opportunityDoc).to.exist;
      expect(opportunityDoc.name).to.equal('Sample Opportunity');
      const studentDoc = VerificationRequests.getStudentDoc(docID);
      expect(studentDoc).to.exist;
      expect(studentDoc.firstName).to.equal(studentFirstName);
      const sponsorDoc = VerificationRequests.getSponsorDoc(docID);
      expect(sponsorDoc).to.exist;
      console.log(sponsorDoc, facultyFirstName);
      expect(sponsorDoc.firstName).to.equal(facultyFirstName);
      const opportunityInstanceDoc = VerificationRequests.getOpportunityInstanceDoc(docID);
      expect(opportunityInstanceDoc).to.exist;
      expect(opportunityInstanceDoc.studentID).to.equal(studentDoc.userID);
      expect(opportunityDoc.sponsorID).to.equal(sponsorDoc.userID);
      expect(opportunityInstanceDoc.opportunityID).to.equal(opportunityDoc._id);
    });

    it('#define with opportunity instance, #isDefined, #findOne, #dumpOne, #removeIt, #restoreOne, #update, #removeUser', function test() {
      docID = VerificationRequests.define({ student, opportunityInstance });
      expect(VerificationRequests.isDefined(docID)).to.be.true;
      expect(VerificationRequests.findOne({ opportunityInstanceID: opportunityInstance })).to.exist;
      const dumpObject = VerificationRequests.dumpOne(docID);
      expect(VerificationRequests.findNonRetired().length).to.equal(2);
      VerificationRequests.removeIt(docID);
      expect(VerificationRequests.isDefined(docID)).to.be.false;
      expect(VerificationRequests.findNonRetired().length).to.equal(1);
      docID = VerificationRequests.restoreOne(dumpObject);
      expect(VerificationRequests.isDefined(docID)).to.be.true;
      VerificationRequests.update(docID, { retired: true });
      expect(VerificationRequests.findNonRetired().length).to.equal(1);
      VerificationRequests.removeUser(student);
      expect(VerificationRequests.count()).to.equal(0);
    });

  });
}
