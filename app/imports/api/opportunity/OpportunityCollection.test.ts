import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import { ROLE } from '../role/Role';
import { defineTestFixtures } from '../test/test-utilities';
import { Opportunities } from './OpportunityCollection';
import { makeSampleInterestArray } from '../interest/SampleInterests';
import { makeSampleOpportunity, makeSampleOpportunityType } from './SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { makeSampleIce } from '../ice/SampleIce';
import { Slugs } from '../slug/SlugCollection';
import { Opportunity, OpportunityType } from '../../typings/radgrad';
import { OpportunityTypes } from './OpportunityTypeCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('OpportunityCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.lorem(2), fc.lorem(1), fc.lorem(10), (name, slug, description) => {
          const sponsor = makeSampleUser(ROLE.FACULTY);
          const interests = makeSampleInterestArray(3);
          const opportunityType = makeSampleOpportunityType();
          const ice = makeSampleIce();
          const docID = Opportunities.define({
            name,
            slug,
            description,
            sponsor,
            interests,
            opportunityType,
            ice,
          });
          expect(Opportunities.isDefined(docID)).to.be.true;
          const doc = Opportunities.findDoc(docID);
          expect(doc.name).to.equal(name);
          expect(doc.description).to.equal(description);
          expect(Slugs.getNameFromID(doc.slugID)).to.equal(slug);
          expect(doc.ice.i).to.equal(ice.i);
          expect(doc.ice.c).to.equal(ice.c);
          expect(doc.ice.e).to.equal(ice.e);
          Opportunities.removeIt(docID);
          expect(Opportunities.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Can define duplicates', function test2(done) {
      const name = faker.lorem.words();
      const slug = faker.lorem.word();
      const ice = makeSampleIce();
      const description = faker.lorem.paragraph();
      const opportunityType = makeSampleOpportunityType();
      const sponsor = makeSampleUser(ROLE.FACULTY);
      const interests = makeSampleInterestArray(2);
      const docID1 = Opportunities.define({
        name,
        slug,
        description,
        opportunityType,
        ice,
        sponsor,
        interests,
      });
      const docID2 = Opportunities.define({
        name,
        slug,
        description,
        opportunityType,
        ice,
        sponsor,
        interests,
      });
      expect(Opportunities.isDefined(slug)).to.be.true;
      expect(Opportunities.isDefined(docID1)).to.be.true;
      expect(Opportunities.isDefined(docID2)).to.be.true;
      expect(docID1).to.equal(docID2);
      Opportunities.removeIt(docID1);
      expect(Opportunities.isDefined(slug)).to.be.false;
      expect(Opportunities.isDefined(docID1)).to.be.false;
      expect(Opportunities.isDefined(docID2)).to.be.false;
      done();
    });

    it('Can update', function test3(done) {
      const name = faker.lorem.words();
      const slug = faker.lorem.word();
      let ice = makeSampleIce();
      const description = faker.lorem.paragraph();
      let opportunityType = makeSampleOpportunityType();
      let sponsor = makeSampleUser(ROLE.FACULTY);
      let interests = makeSampleInterestArray(2);
      const docID = Opportunities.define({
        name,
        slug,
        description,
        opportunityType,
        ice,
        sponsor,
        interests,
      });
      let doc = Opportunities.findDoc(docID);
      fc.assert(
        fc.property(fc.lorem(2), fc.lorem(10), fc.boolean(), (fcName, fcDescription, retired) => {
          ice = makeSampleIce();
          opportunityType = makeSampleOpportunityType();
          sponsor = makeSampleUser(ROLE.FACULTY);
          interests = makeSampleInterestArray(2);
          Opportunities.update(docID, {
            name: fcName,
            description: fcDescription,
            ice,
            interests,
            sponsor,
            opportunityType,
            retired,
          });
          doc = Opportunities.findDoc(docID);
          expect(doc.name).to.equal(fcName);
          expect(doc.description).to.equal(fcDescription);
          expect(doc.ice.i).to.equal(ice.i);
          expect(doc.ice.c).to.equal(ice.c);
          expect(doc.ice.e).to.equal(ice.e);
          expect(doc.retired).to.equal(retired);
        }),
      );
      Opportunities.removeIt(docID);
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const sponsor = makeSampleUser(ROLE.FACULTY);
      let docID = makeSampleOpportunity(sponsor);
      const origOpp: Opportunity = Opportunities.findDoc(docID);
      const dumpObject = Opportunities.dumpOne(docID);
      Opportunities.removeIt(docID);
      expect(Opportunities.isDefined(docID)).to.be.false;
      docID = Opportunities.restoreOne(dumpObject);
      const restored: Opportunity = Opportunities.findDoc(docID);
      expect(origOpp.name).to.equal(restored.name);
      // expect(origOpp.slugID).to.equal(restored.slugID);
      expect(origOpp.description).to.equal(restored.description);
      expect(origOpp.retired).to.equal(restored.retired);
    });

    it('Can checkIntegrity no errors', function test5() {
      const problems = Opportunities.checkIntegrity();
      expect(problems.length).to.equal(0);
    });

    it('Can getOpportunityTypeDoc and hasInterest', function test6() {
      const name = faker.lorem.words();
      const slug = faker.lorem.word();
      const ice = makeSampleIce();
      const description = faker.lorem.paragraph();
      const opportunityType = makeSampleOpportunityType();
      const sponsor = makeSampleUser(ROLE.FACULTY);
      const interests = makeSampleInterestArray(2);
      const docID = Opportunities.define({
        name,
        slug,
        description,
        opportunityType,
        ice,
        sponsor,
        interests,
      });
      const oppTypeDocOrig: OpportunityType = OpportunityTypes.findDoc(opportunityType);
      const oppTypeDoc: OpportunityType = Opportunities.getOpportunityTypeDoc(docID);
      expect(oppTypeDocOrig.name).to.equal(oppTypeDoc.name);
      expect(oppTypeDocOrig.description).to.equal(oppTypeDoc.description);
      expect(oppTypeDocOrig.retired).to.equal(oppTypeDoc.retired);
      expect(Opportunities.hasInterest(docID, interests[0])).to.be.true;
    });

    it('Can findRelatedCareerGoals', function test7() {
      defineTestFixtures(['minimal', 'opportunities', 'betty.student']);
      let opportunity = Opportunities.findDoc('ACM ICPC');
      let relatedCareerGoals = Opportunities.findRelatedCareerGoals(opportunity._id);
      expect(relatedCareerGoals.length).to.equal(2);
      opportunity = Opportunities.findDoc('ACM Manoa');
      relatedCareerGoals = Opportunities.findRelatedCareerGoals(opportunity._id);
      expect(relatedCareerGoals.length).to.equal(0);
    });

    it('Can findRelatedCourses', function test8() {
      let opportunity = Opportunities.findDoc('ACM ICPC');
      let relatedCourses = Opportunities.findRelatedCourses(opportunity._id);
      expect(relatedCourses.length).to.equal(1);
      opportunity = Opportunities.findDoc('ACM Manoa');
      relatedCourses = Opportunities.findRelatedCourses(opportunity._id);
      expect(relatedCourses.length).to.equal(1);
    });
  });
}
