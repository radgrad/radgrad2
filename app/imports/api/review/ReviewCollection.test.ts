import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { ROLE } from '../role/Role';
import { Reviews } from '../review/ReviewCollection';
import { defineAcademicTerms } from '../academic-term/AcademicTermUtilities';
import { makeSampleOpportunity } from '../opportunity/SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';

/* tslint:disable:ter-prefer-arrow-callback no-unused-expression */

if (Meteor.isServer) {
  describe('ReviewCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      defineAcademicTerms();
      const slug: string = 'sample-opportunity-review';
      const student: string = makeSampleUser();
      const reviewType: string = 'opportunity';
      const faculty: string = makeSampleUser(ROLE.FACULTY);
      const reviewee: string = makeSampleOpportunity(faculty);
      const academicTerm: string = 'Fall-2015';
      const rating: number = 3;
      const comments: string = 'What a great course to write a test review for!';
      let docID = Reviews.define({ slug, student, reviewType, reviewee, academicTerm, rating, comments });
      expect(Reviews.isDefined(docID)).to.be.true;
      const dumpObject = Reviews.dumpOne(docID);
      Reviews.removeIt(docID);
      expect(Reviews.isDefined(slug)).to.be.false;
      docID = Reviews.restoreOne(dumpObject);
      expect(Reviews.isDefined(docID)).to.be.true;
      Reviews.removeIt(docID);
    });
  });
}
