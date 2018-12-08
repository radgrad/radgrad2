import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { AcademicTerms } from '../semester/AcademicTermCollection';
import { defineSemesters } from '../semester/SemesterUtilities';
import { ROLE } from '../role/Role';
import { OpportunityInstances } from './OpportunityInstanceCollection';
import { makeSampleOpportunity } from './SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';

/* tslint:disable:ter-prefer-arrow-callback no-unused-expression */

if (Meteor.isServer) {
  describe('OpportunityInstanceCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #toString, #dumpOne, #restoreOne, findOpportunityInstance', function test() {
      defineSemesters();
      const semester: string = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2015 });
      const faculty: string = makeSampleUser(ROLE.FACULTY);
      const student: string = makeSampleUser();
      const opportunity: string = makeSampleOpportunity(faculty);
      const verified: boolean = true;
      let docID = OpportunityInstances.define({ semester, opportunity, sponsor: faculty, verified, student });
      expect(OpportunityInstances.isOpportunityInstance(semester, opportunity, student)).to.be.true;
      expect(OpportunityInstances.isOpportunityInstance(semester, opportunity, faculty)).to.be.false;
      const dumpObject = OpportunityInstances.dumpOne(docID);
      expect(OpportunityInstances.isDefined(docID)).to.be.true;
      OpportunityInstances.toString(docID);
      OpportunityInstances.removeIt(docID);
      expect(OpportunityInstances.isDefined(docID)).to.be.false;
      docID = OpportunityInstances.restoreOne(dumpObject);
      expect(OpportunityInstances.isDefined(docID)).to.be.true;
      OpportunityInstances.removeIt(docID);
    });
  });
}
