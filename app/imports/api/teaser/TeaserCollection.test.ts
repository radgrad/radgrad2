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
import slugify from '../slug/SlugCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('TeaserCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(25000);
      fc.assert(
        fc.property(fc.lorem(3), fc.lorem(2), fc.lorem(10), fc.lorem(1), (fcTitle, fcAuthor, fcDescription, fcDuration) => {
          const slug = slugify(fcTitle);
          const url = faker.internet.url();
          const interests = [makeSampleInterest()];
          const opportunity = makeSampleOpportunity(makeSampleUser(ROLE.FACULTY));
          const docID = Teasers.define({
            title: fcTitle,
            slug,
            author: fcAuthor,
            url,
            description: fcDescription,
            duration: fcDuration,
            interests,
            opportunity,
          });
          expect(Teasers.isDefined(docID)).to.be.true;
          Teasers.removeIt(docID);
          expect(Teasers.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });


    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      // Define teaser data.
      const title = 'Teaser Test Title';
      const slug = 'teaser-test-title';
      const author = 'Amy';
      const url = 'http://www.youtube.com/sample';
      const description = 'This is a test teaser';
      const duration = '1:32:14';
      const interests = [makeSampleInterest()];
      const opportunity = makeSampleOpportunity(makeSampleUser(ROLE.FACULTY));
      let instanceID = Teasers.define({ title, slug, author, url, description, duration, interests, opportunity });
      expect(Teasers.isDefined(instanceID)).to.be.true;
      const dumpObject = Teasers.dumpOne(instanceID);
      Teasers.removeIt(instanceID);
      expect(Teasers.isDefined(instanceID)).to.be.false;
      instanceID = Teasers.restoreOne(dumpObject);
      expect(Teasers.isDefined(slug)).to.be.true;
    });
  });
}
