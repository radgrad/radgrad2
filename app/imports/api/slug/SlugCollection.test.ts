import { expect } from 'chai';
import { Meteor } from 'meteor/meteor';
import fc from 'fast-check';
import faker from 'faker';
import { removeAllEntities } from '../base/BaseUtilities';
import slugify, { Slugs } from './SlugCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('SlugCollection', function testSuite() {

    before(function setup() {
      removeAllEntities();
      Slugs.removeAll();
    });

    after(function teardown() {
      removeAllEntities();
      Slugs.removeAll();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.lorem(3), fc.lorem(1), (fcSlugName, fcEntityName) => {
          const slugName = slugify(fcSlugName);
          const docID = Slugs.define({ name: slugName, entityName: fcEntityName });
          expect(Slugs.isDefined(docID)).to.be.true;
          expect(Slugs.isSlugForEntity(slugName, fcEntityName)).to.be.true;
          Slugs.removeIt(docID);
          expect(Slugs.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Can not define duplicates', function test2() {
      const lName: string = faker.lorem.word();
      const lEntityName = faker.lorem.word();
      const docID = Slugs.define({ name: lName, entityName: lEntityName });
      expect(Slugs.isDefined(docID)).to.be.true;
      expect(() => Slugs.define({ name: lName, entityName: lEntityName })).to.throw(Error);
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const origDoc = Slugs.findOne({});
      let docID = origDoc._id;
      const dumpObject = Slugs.dumpOne(docID);
      Slugs.removeIt(docID);
      expect(Slugs.isDefined(docID)).to.be.false;
      docID = Slugs.restoreOne(dumpObject);
      expect(Slugs.isDefined(docID)).to.be.true;
      const restored = Slugs.findDoc(docID);
      expect(restored.name).to.equal(origDoc.name);
      expect(restored.entityName).to.equal(origDoc.entityName);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = Slugs.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });

    it('#isValidSlugName', function test() {
      expect(Slugs.isValidSlugName('slug123')).to.be.true;
      expect(Slugs.isValidSlugName('slug-123')).to.be.true;
      expect(Slugs.isValidSlugName('Slug-123')).to.be.true;
      expect(Slugs.isValidSlugName('slug-123#')).to.be.false;
      expect(Slugs.isValidSlugName('slug 123')).to.be.false;
      expect(Slugs.isValidSlugName('slug_123')).to.be.true;
      expect(Slugs.isValidSlugName('')).to.be.false;
      // expect(Slugs.isValidSlugName(12)).to.be.false;
    });
  });
}
