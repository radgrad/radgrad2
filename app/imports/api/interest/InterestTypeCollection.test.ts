import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import 'mocha';
import { InterestTypes } from './InterestTypeCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { Slugs } from '../slug/SlugCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('InterestTypeCollection', function testSuite() {
    let name = 'Interest Name';
    let slug = 'interest-slug';
    let description = 'Interest Description';

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.lorem(3), fc.lorem(1), fc.lorem(24), fc.boolean(), (fcName, fcSlug, fcDescription, fcRetired) => {
          const localSlug = `${fcSlug}-${new Date().getTime()}`;
          const docID = InterestTypes.define({
            name: fcName,
            slug: localSlug,
            description: fcDescription,
            retired: fcRetired,
          });
          expect(InterestTypes.isDefined(docID)).to.be.true;
          const typeDoc = InterestTypes.findDoc(docID);
          expect(typeDoc.name).to.equal(fcName);
          expect(typeDoc.description).to.equal(fcDescription);
          expect(Slugs.getNameFromID(typeDoc.slugID)).to.equal(localSlug);
          expect(typeDoc.retired).to.equal(fcRetired);
          InterestTypes.removeIt(docID);
          expect(InterestTypes.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Cannot define duplicates', function test2() {
      name = faker.lorem.words();
      slug = faker.lorem.word();
      description = faker.lorem.paragraph();
      const docID1 = InterestTypes.define({ name, slug, description });
      expect(InterestTypes.isDefined(docID1)).to.be.true;
      expect(() => InterestTypes.define({ name, slug, description })).to.throw(Error);
    });

    it('Can update', function test3(done) {
      let typeDoc = InterestTypes.findOne({});
      const docID = typeDoc._id;
      fc.assert(
        fc.property(fc.lorem(4), fc.lorem(24), fc.boolean(), (fcName, fcDescription, fcRetired) => {
          InterestTypes.update(docID, { name: fcName, description: fcDescription, retired: fcRetired });
          typeDoc = InterestTypes.findDoc(docID);
          expect(typeDoc.name).to.equal(fcName);
          expect(typeDoc.description).to.equal(fcDescription);
          expect(typeDoc.retired).to.equal(fcRetired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let typeDoc = InterestTypes.findOne({});
      let docID = typeDoc._id;
      const dumpObject = InterestTypes.dumpOne(docID);
      InterestTypes.removeIt(docID);
      expect(InterestTypes.isDefined(docID)).to.be.false;
      docID = InterestTypes.restoreOne(dumpObject);
      typeDoc = InterestTypes.findDoc(docID);
      expect(typeDoc.name).to.equal(dumpObject.name);
      expect(typeDoc.description).to.equal(dumpObject.description);
      expect(typeDoc.retired).to.equal(dumpObject.retired);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = InterestTypes.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });
  });
}
