import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { ROLE } from '../role/Role';
import { VerificationRequests } from './VerificationRequestCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { makeSampleOpportunityInstance, makeSampleOpportunity } from '../opportunity/SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';

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

    it('#define, #isDefined, #removeIt, #findOne, #toString, #dumpOne, #restoreOne', function test() {
      AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2015 });
      AcademicTerms.define({ term: AcademicTerms.FALL, year: 2015 });
      const student = makeSampleUser();
      const faculty = makeSampleUser(ROLE.FACULTY);
      const opportunityInstance = makeSampleOpportunityInstance(student, faculty);
      let docID = VerificationRequests.define({ student, opportunityInstance });
      expect(VerificationRequests.isDefined(docID)).to.be.true;
      expect(VerificationRequests.findOne({ opportunityInstanceID: opportunityInstance })).to.exist;
      VerificationRequests.toString(docID);
      const dumpObject = VerificationRequests.dumpOne(docID);
      VerificationRequests.removeIt(docID);
      expect(VerificationRequests.isDefined(docID)).to.be.false;
      docID = VerificationRequests.restoreOne(dumpObject);
      expect(VerificationRequests.isDefined(docID)).to.be.true;
      VerificationRequests.removeIt(docID);
    });

    it('#define using academicTerm and opportunity', function test() {
      const academicTerm = AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2015 });
      const opportunity = makeSampleOpportunity(makeSampleUser(ROLE.FACULTY));
      const student = makeSampleUser();
      const sponsor = makeSampleUser(ROLE.FACULTY);
      const verified = false;
      OpportunityInstances.define({ academicTerm, opportunity, sponsor, student, verified });
      const docID = VerificationRequests.define({ student, academicTerm, opportunity });
      expect(VerificationRequests.isDefined(docID)).to.be.true;
      VerificationRequests.removeIt(docID);
    });
  });
}
