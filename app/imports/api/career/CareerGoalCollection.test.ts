import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import 'mocha';
import { CareerGoals } from './CareerGoalCollection';
import { makeSampleInterest } from '../interest/SampleInterests';
import { removeAllEntities } from '../base/BaseUtilities';
import slugify from '../slug/SlugCollection';
import { Interests } from '../interest/InterestCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('CareerGoalCollection', function testSuite() {
    const name = faker.lorem.words();
    const slug = slugify(name);
    const description = faker.lorem.paragraph();

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(50000);
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(1), fc.lorem(5, true), (fcName, fcSlug, fcDescription) => {
          const interests = [makeSampleInterest(), makeSampleInterest()];
          const docID = CareerGoals.define({ name: fcName, slug: fcSlug, description: fcDescription, interests });
          expect(CareerGoals.isDefined(docID)).to.be.true;
          expect(CareerGoals.findSlugByID(docID)).to.equal(fcSlug);
          CareerGoals.removeIt(docID);
          expect(CareerGoals.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Can define duplicates', function test2() {
      const interests = [makeSampleInterest()];
      const docId1 = CareerGoals.define({ name, slug, description, interests });
      const docId2 = CareerGoals.define({ name, slug, description, interests });
      expect(docId1).to.equal(docId2);
      expect(CareerGoals.isDefined(docId1)).to.be.true;
      expect(CareerGoals.isDefined(docId2)).to.be.true;
      CareerGoals.removeIt(docId1);
      expect(CareerGoals.isDefined(docId1)).to.be.false;
      expect(CareerGoals.isDefined(docId2)).to.be.false;
    });

    it('Can find names', function test3() {
      const interests = [makeSampleInterest()];
      const docID = CareerGoals.define({ name, slug, description, interests });
      expect(CareerGoals.findNames([docID])[0]).to.equal(name);
      CareerGoals.removeIt(docID);
    });

    it('Can update', function test4(done) {
      this.timeout(50000);
      const interests = [makeSampleInterest()];
      const interest2 = [makeSampleInterest(), makeSampleInterest()];
      const docID = CareerGoals.define({ name, slug, description, interests });
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(5, true), fc.boolean(), (fcName, fcDescription, fcRetired) => {
          CareerGoals.update(docID, { name: fcName, description: fcDescription, interests: interest2, retired: fcRetired });
          const doc = CareerGoals.findDoc(docID);
          expect(doc.name).to.equal(fcName);
          expect(doc.description).to.equal(fcDescription);
          expect(doc.interestIDs).to.have.lengthOf(2);
          expect(doc.interestIDs[0]).to.equal(interest2[0]);
          expect(doc.retired).to.equal(fcRetired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test5() {
      let docID = CareerGoals.getID(slug);
      const dumpObject = CareerGoals.dumpOne(docID);
      CareerGoals.removeIt(docID);
      expect(CareerGoals.isDefined(slug)).to.be.false;
      docID = CareerGoals.restoreOne(dumpObject);
      expect(CareerGoals.isDefined(slug)).to.be.true;
    });

    it('Can checkIntegrity no errors', function test6() {
      const errors = CareerGoals.checkIntegrity();
      expect(errors.length).to.equal(0);
    });

    it('Can get Interest', function test7() {
      const docID = CareerGoals.getID(slug);
      const careerGoal = CareerGoals.findDoc(docID);
      const interest = Interests.findDoc(careerGoal.interestIDs[0]);
      expect(CareerGoals.hasInterest(docID, interest._id)).to.be.true;
    });

    it('findDoc(undefined) throws', function test8() {
      expect(() => CareerGoals.findDoc(undefined)).to.throw(Error);
    });
  });
}
