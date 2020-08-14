import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import 'mocha';
import { DesiredDegrees } from './DesiredDegreeCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('DesiredDegreeCollection', function testSuite() {

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(5000);
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(1), fc.lorem(1), fc.lorem(6), fc.boolean(), (fcName, fcShortName, fcSlug, fcDescription, fcRetired) => {
          const docID = DesiredDegrees.define({
            name: fcName,
            shortName: fcShortName,
            description: fcDescription,
            slug: fcSlug,
            retired: fcRetired,
          });
          expect(DesiredDegrees.isDefined(docID)).to.be.true;
          const dd = DesiredDegrees.findDoc(docID);
          expect(dd.name).to.equal(fcName);
          expect(dd.shortName).to.equal(fcShortName);
          expect(dd.description).to.equal(fcDescription);
          expect(dd.retired).to.equal(fcRetired);
          DesiredDegrees.removeIt(docID);
          expect(DesiredDegrees.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Cannot define duplicates', function test2() {
      const name = faker.lorem.word();
      const shortName = faker.lorem.word();
      const description = faker.lorem.paragraph();
      const slug = faker.lorem.word();
      const retired = faker.random.boolean();
      const docID = DesiredDegrees.define({ name, shortName, description, slug, retired });
      expect(DesiredDegrees.isDefined(docID)).to.be.true;
      expect(() => DesiredDegrees.define({ name, shortName, description, slug, retired })).to.throw();
      DesiredDegrees.removeIt(docID);
      expect(DesiredDegrees.isDefined(docID)).to.be.false;
    });

    it('Can update', function test3(done) {
      this.timeout(5000);
      const name = faker.lorem.word();
      const shortName = faker.lorem.word();
      const description = faker.lorem.paragraph();
      const slug = faker.lorem.word();
      const retired = faker.random.boolean();
      const docID = DesiredDegrees.define({ name, shortName, description, slug, retired });
      fc.assert(
        fc.property(fc.lorem(3), fc.lorem(1), fc.lorem(20, true), fc.boolean(), (fcName, fcShortName, fcDescription, fcRetired) => {
          DesiredDegrees.update(docID, { name: fcName, shortName: fcShortName, description: fcDescription, retired: fcRetired });
          const dd = DesiredDegrees.findDoc(docID);
          expect(dd.name).to.equal(fcName);
          expect(dd.shortName).to.equal(fcShortName);
          expect(dd.description).to.equal(fcDescription);
          expect(dd.retired).to.equal(fcRetired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let dd = DesiredDegrees.findOne({});
      let docID = dd._id;
      expect(DesiredDegrees.isDefined(docID)).to.be.true;
      const dumpObject = DesiredDegrees.dumpOne(docID);
      DesiredDegrees.removeIt(docID);
      expect(DesiredDegrees.isDefined(docID)).to.be.false;
      docID = DesiredDegrees.restoreOne(dumpObject);
      expect(DesiredDegrees.isDefined(docID)).to.be.true;
      dd = DesiredDegrees.findDoc(docID);
      expect(dd.name).to.equal(dumpObject.name);
      expect(dd.shortName).to.equal(dumpObject.shortName);
      expect(dd.description).to.equal(dumpObject.description);
      expect(dd.retired).to.equal(dumpObject.retired);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = DesiredDegrees.checkIntegrity();
      expect(errors.length).to.equal(0);
    });
  });
}
