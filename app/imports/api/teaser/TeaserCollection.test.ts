import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import { removeAllEntities } from '../base/BaseUtilities';
import { Teasers } from './TeaserCollection';
import { makeSampleInterest } from '../interest/SampleInterests';
import { makeSampleOpportunity } from '../opportunity/SampleOpportunities';
import { makeSampleUser } from '../user/SampleUsers';
import { ROLE } from '../role/Role';
import slugify, { Slugs } from '../slug/SlugCollection';
import { makeSampleCareerGoal } from '../career/SampleCareerGoals';
import { makeSampleCourse } from '../course/SampleCourses';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection';
import { Interests } from '../interest/InterestCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

const makeSampleTeaserTargetSlug = () => {
  const rand = faker.random.number(0, 3);
  let docID;
  let doc;
  switch (rand) {
    case 0:
      docID = makeSampleCareerGoal();
      doc = CareerGoals.findDoc(docID);
      break;
    case 1:
      docID = makeSampleCourse();
      doc = Courses.findDoc(docID);
      break;
    case 2:
      docID = makeSampleInterest();
      doc = Interests.findDoc(docID);
      break;
    default:
      docID = makeSampleOpportunity(makeSampleUser(ROLE.FACULTY));
  }
  return Slugs.getNameFromID(doc.slugID);
};

if (Meteor.isServer) {
  describe('TeaserCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.lorem(3), fc.lorem(2), fc.lorem(10), fc.lorem(1), (fcTitle, fcAuthor, fcDescription, fcDuration) => {
          const slug = slugify(fcTitle);
          const url = faker.internet.url();
          const interests = [makeSampleInterest()];
          // const opportunity = makeSampleOpportunity(makeSampleUser(ROLE.FACULTY));
          const targetSlug = makeSampleTeaserTargetSlug();
          const docID = Teasers.define({
            title: fcTitle,
            slug,
            author: fcAuthor,
            url,
            description: fcDescription,
            duration: fcDuration,
            interests,
            targetSlug,
          });
          expect(Teasers.isDefined(docID)).to.be.true;
          Teasers.removeIt(docID);
          expect(Teasers.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Can not define duplicates', function test2() {
      const title = faker.lorem.words(3);
      const slug = slugify(title);
      const author = faker.internet.email();
      const url = faker.internet.url();
      const description = faker.lorem.paragraph();
      const duration = faker.lorem.word();
      const interests = [makeSampleInterest()];
      const targetSlug = makeSampleTeaserTargetSlug();
      const docID = Teasers.define({
        title,
        slug,
        author,
        url,
        description,
        duration,
        interests,
        targetSlug,
      });
      expect(Teasers.isDefined(docID)).to.be.true;
      expect(() => Teasers.define({
        title,
        slug,
        author,
        url,
        description,
        duration,
        interests,
        targetSlug,
      })).to.throw(Error);
    });

    it('Can update', function test3(done) {
      let doc = Teasers.findOne({});
      const docID = doc._id;
      fc.assert(
        fc.property(fc.lorem(3), fc.lorem(1), fc.lorem(10), fc.lorem(1), fc.boolean(), (fcTitle, fcAuthor, fcDescription, fcDuration, fcRetired) => {
          const interests = [makeSampleInterest()];
          const targetSlug = makeSampleTeaserTargetSlug();
          const url = faker.internet.url();
          Teasers.update(docID, {
            title: fcTitle,
            targetSlug,
            interests,
            author: fcAuthor,
            url,
            description: fcDescription,
            duration: fcDuration,
            retired: fcRetired,
          });
          doc = Teasers.findDoc(docID);
          expect(doc.title).to.equal(fcTitle);
          expect(Slugs.getNameFromID(doc.targetSlugID)).to.equal(targetSlug);
          expect(doc.author).to.equal(fcAuthor);
          expect(doc.url).to.equal(url);
          expect(doc.description).to.equal(fcDescription);
          expect(doc.duration).to.equal(fcDuration);
          expect(doc.retired).to.equal(fcRetired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const origDoc = Teasers.findOne({});
      let docID = origDoc._id;
      const dumpObject = Teasers.dumpOne(docID);
      Teasers.removeIt(docID);
      expect(Teasers.isDefined(docID)).to.be.false;
      docID = Teasers.restoreOne(dumpObject);
      expect(Teasers.isDefined(docID)).to.be.true;
      const doc = Teasers.findDoc(docID);
      expect(doc.title).to.equal(origDoc.title);
      expect(doc.targetSlugID).to.equal(origDoc.targetSlugID);
      expect(doc.author).to.equal(origDoc.author);
      expect(doc.url).to.equal(origDoc.url);
      expect(doc.description).to.equal(origDoc.description);
      expect(doc.duration).to.equal(origDoc.duration);
      expect(doc.retired).to.equal(origDoc.retired);
    });

    it('Can checkIntegrity no errors', function test5() {
      const problems = Teasers.checkIntegrity();
      expect(problems).to.have.lengthOf(0);
    });
  });
}
