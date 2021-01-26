import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import 'mocha';
import { OpportunityTypes } from './OpportunityTypeCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { OpportunityType } from '../../typings/radgrad';
import { Slugs } from '../slug/SlugCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('OpportunityTypeCollection', function testSuite() {
    let name = 'InternshipOpportunity';
    let slug = 'internship-slug';
    let description = 'Work in a real-world setting for a semester or summer.';

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.lorem(3), fc.lorem(24), fc.boolean(), (fcName, fcDescription, fcRetired) => {
          const fcSlug = `slug-${new Date().getTime()}`;
          const docID = OpportunityTypes.define({
            name: fcName,
            slug: fcSlug,
            description: fcDescription,
            retired: fcRetired,
          });
          expect(OpportunityTypes.isDefined(docID)).to.be.true;
          const doc: OpportunityType = OpportunityTypes.findDoc(docID);
          expect(doc.name).to.equal(fcName);
          expect(doc.description).to.equal(fcDescription);
          expect(Slugs.getNameFromID(doc.slugID)).to.equal(fcSlug);
          expect(doc.retired).to.equal(fcRetired);
          OpportunityTypes.removeIt(docID);
          expect(OpportunityTypes.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Cannot define duplicates', function test2() {
      name = faker.lorem.words();
      slug = faker.lorem.word();
      description = faker.lorem.paragraph();
      const docID = OpportunityTypes.define({
        name,
        slug,
        description,
      });
      expect(OpportunityTypes.isDefined(docID)).to.be.true;
      expect(() =>
        OpportunityTypes.define({
          name,
          slug,
          description,
        }),
      ).to.throw(Error);
    });

    it('Can update', function test3(done) {
      let doc = OpportunityTypes.findOne({});
      const docID = doc._id;
      fc.assert(
        fc.property(fc.lorem(4), fc.lorem(24), fc.boolean(), (fcName, fcDescription, fcRetired) => {
          OpportunityTypes.update(docID, {
            name: fcName,
            description: fcDescription,
            retired: fcRetired,
          });
          doc = OpportunityTypes.findDoc(docID);
          expect(doc.name).to.equal(fcName);
          expect(doc.description).to.equal(fcDescription);
          expect(doc.retired).to.equal(fcRetired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const doc = OpportunityTypes.findOne({});
      let docID = doc._id;
      const dumpObject = OpportunityTypes.dumpOne(docID);
      OpportunityTypes.removeIt(docID);
      expect(OpportunityTypes.isDefined(docID)).to.be.false;
      docID = OpportunityTypes.restoreOne(dumpObject);
      const restored = OpportunityTypes.findDoc(docID);
      expect(doc.name).to.equal(restored.name);
      expect(doc.description).to.equal(restored.description);
      expect(doc.retired).to.equal(restored.retired);
      expect(Slugs.getNameFromID(restored.slugID)).to.equal(dumpObject.slug);
    });

    it('Can checkIntegrity no errors', function test5() {
      const problems = OpportunityTypes.checkIntegrity();
      expect(problems.length).to.equal(0);
    });

    it('Can findDocBySlug', function test() {
      name = faker.lorem.words();
      slug = `${faker.lorem.word()}-${new Date().getTime()}`;
      description = faker.lorem.paragraph();
      OpportunityTypes.define({ name, slug, description });
      const doc = OpportunityTypes.findDocBySlug(slug);
      expect(doc).to.be.an('object');
      OpportunityTypes.removeIt(slug);
      expect(function foo() {
        OpportunityTypes.findDocBySlug('notASlug');
      }).to.throw(Error);
    });
  });
}
