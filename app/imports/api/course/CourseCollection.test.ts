import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import 'mocha';
import { Courses } from './CourseCollection';
import { makeSampleInterest, makeSampleInterestArray } from '../interest/SampleInterests';
import { removeAllEntities } from '../base/BaseUtilities';
import { getRandomCourseSlug } from './CourseUtilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('CourseCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(5000);
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(1), fc.lorem(20, true), fc.integer(1, 6), (fcName, fcNum, fcDescription, fcCreditHrs) => {
          const interests = makeSampleInterestArray();
          const slug = getRandomCourseSlug();
          const docID1 = Courses.define({ name: fcName, slug, num: fcNum, description: fcDescription, creditHrs: fcCreditHrs, interests });
          expect(Courses.isDefined(docID1)).to.be.true;
          Courses.removeIt(docID1);
          expect(Courses.isDefined(docID1)).to.be.false;
        }),
      );
      done();
    });

    it('Can define duplicates', function test2(done) {
      const name = faker.lorem.word();
      const slug = getRandomCourseSlug();
      const num = faker.lorem.word();
      const description = faker.lorem.paragraph();
      const creditHrs = faker.random.number({
        min: 1,
        max: 6,
      });
      const interests = makeSampleInterestArray(faker.random.number({
        min: 1,
        max: 6,
      }));
      const docID1 = Courses.define({ name, slug, num, description, creditHrs, interests });
      const docID2 = Courses.define({ name, slug, num, description, creditHrs, interests });
      expect(Courses.isDefined(slug)).to.be.true;
      expect(Courses.isDefined(docID1)).to.be.true;
      expect(Courses.isDefined(docID2)).to.be.true;
      expect(docID1).to.equal(docID2);
      expect(Courses.findDoc(docID1).shortName).to.equal(name);
      Courses.removeIt(docID2);
      expect(Courses.isDefined(slug)).to.be.false;
      expect(Courses.isDefined(docID1)).to.be.false;
      expect(Courses.isDefined(docID2)).to.be.false;
      done();
    });

      it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      const name = 'Algorithms';
      const slug = 'ics_311';
      const num = 'ICS 311';
      const description = 'Study algorithms';
      const creditHrs = 3;
      const interests = [makeSampleInterest()];
      const docID = Courses.define({ name, slug, num, description, creditHrs, interests });
      expect(Courses.isDefined(slug)).to.be.true;
      expect(Courses.findDoc(docID).shortName).to.equal(name);
      const dumpObject = Courses.dumpOne(docID);
      expect(Courses.countNonRetired()).to.equal(1);
      Courses.update(docID, { retired: true });
      expect(Courses.countNonRetired()).to.equal(0);
      Courses.removeIt(slug);
      expect(Courses.isDefined(slug)).to.be.false;
      Courses.restoreOne(dumpObject);
      expect(Courses.isDefined(slug)).to.be.true;
      Courses.removeIt(slug);
    });

    it('course shortname', function test() {
      const name = 'Algorithms';
      const shortName = 'Algo';
      const slug = 'ics_311';
      const num = 'ICS 311';
      const description = 'Study algorithms';
      const creditHrs = 3;
      const interests = [makeSampleInterest()];
      const docID = Courses.define({ name, shortName, slug, num, description, creditHrs, interests });
      expect(Courses.isDefined(slug)).to.be.true;
      expect(Courses.findDoc(docID).shortName).to.equal(shortName);
      Courses.removeIt(slug);
      expect(Courses.isDefined(slug)).to.be.false;
    });
  });
}
