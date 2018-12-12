import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { ROLE } from '../role/Role';
import { Opportunities } from './OpportunityCollection';
import { defineAcademicTerms } from '../academic-term/AcademicTermUtilities';
import { makeSampleInterest } from '../interest/SampleInterests';
import { makeSampleOpportunityType } from './SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';

/* tslint:disable:ter-prefer-arrow-callback no-unused-expression */

if (Meteor.isServer) {
  describe('OpportunityCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      defineAcademicTerms();
      const name = 'ATT Hackathon';
      const slug = 'att-hackathon-2016';
      const ice = { i: 10, c: 0, e: 10 };
      const description = 'Programming challenge at Sacred Hearts Academy, March 1, 2016.';
      const opportunityType = makeSampleOpportunityType();
      const sponsor = makeSampleUser(ROLE.FACULTY);
      const interests = [makeSampleInterest()];
      const academicTerms = ['Fall-2015'];
      let docID = Opportunities.define({
        name, slug, description, opportunityType, sponsor, interests, academicTerms, ice,
      });
      expect(Opportunities.isDefined(docID)).to.be.true;
      const dumpObject = Opportunities.dumpOne(docID);
      expect(Opportunities.countNonRetired()).to.equal(1);
      Opportunities.update(docID, { retired: true });
      expect(Opportunities.countNonRetired()).to.equal(0);
      Opportunities.removeIt(docID);
      expect(Opportunities.isDefined(slug)).to.be.false;
      docID = Opportunities.restoreOne(dumpObject);
      expect(Opportunities.isDefined(docID)).to.be.true;
      Opportunities.removeIt(docID);
    });
  });
}
