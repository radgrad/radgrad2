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

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('VerificationRequestCollection', function testSuite() {
    let academicTerm;
    let student;
    let faculty;
    let opportunityInstance;
    let opportunity;
    const verified = false;
    before(function setup() {
      removeAllEntities();
      academicTerm = AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2015 });
      AcademicTerms.define({ term: AcademicTerms.FALL, year: 2015 });
      student = makeSampleUser();
      faculty = makeSampleUser(ROLE.FACULTY);
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
      const docID = VerificationRequests.define({ student, academicTerm, opportunity });
      expect(VerificationRequests.isDefined(docID)).to.be.true;
    });

    it('#define with opportunity instance, #isDefined, #findOne, #dumpOne, #removeIt, #restoreOne, #update, #removeUser', function test() {
      let docID = VerificationRequests.define({ student, opportunityInstance });
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
