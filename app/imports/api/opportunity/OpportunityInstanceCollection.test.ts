import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { defineAcademicTerms } from '../academic-term/AcademicTermUtilities';
import { ROLE } from '../role/Role';
import { OpportunityInstances } from './OpportunityInstanceCollection';
import { makeSampleOpportunity } from './SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { VerificationRequests } from '../verification/VerificationRequestCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('OpportunityInstanceCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #toString, #dumpOne, #restoreOne, findOpportunityInstance', function test() {
      defineAcademicTerms();
      const academicTerm: string = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2015 });
      const faculty: string = makeSampleUser(ROLE.FACULTY);
      const student: string = makeSampleUser();
      const opportunity: string = makeSampleOpportunity(faculty);
      const verified: boolean = true;
      let docID = OpportunityInstances.define({ academicTerm, opportunity, sponsor: faculty, verified, student });
      expect(OpportunityInstances.isOpportunityInstance(academicTerm, opportunity, student)).to.be.true;
      expect(OpportunityInstances.isOpportunityInstance(academicTerm, opportunity, faculty)).to.be.false;
      const dumpObject = OpportunityInstances.dumpOne(docID);
      expect(OpportunityInstances.isDefined(docID)).to.be.true;
      OpportunityInstances.toString(docID);
      OpportunityInstances.removeIt(docID);
      expect(OpportunityInstances.isDefined(docID)).to.be.false;
      docID = OpportunityInstances.restoreOne(dumpObject);
      expect(OpportunityInstances.isDefined(docID)).to.be.true;
      OpportunityInstances.removeIt(docID);
    });
    it('dangling VR', function test() {
      const academicTerm = AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2019 });
      const faculty = makeSampleUser(ROLE.FACULTY);
      const student = makeSampleUser();
      const opportunity = makeSampleOpportunity(faculty);
      const verified = false;
      const docID = OpportunityInstances.define({ academicTerm, opportunity, verified, student });
      const vrID = VerificationRequests.define({ student, opportunityInstance: docID });
      expect(OpportunityInstances.isOpportunityInstance(academicTerm, opportunity, student)).to.be.true;
      expect(VerificationRequests.isDefined(vrID)).to.be.true;
      OpportunityInstances.removeIt(docID);
      expect(OpportunityInstances.isDefined(docID)).to.be.false;
      expect(VerificationRequests.isDefined(vrID)).to.be.false;
    });
  });
}
