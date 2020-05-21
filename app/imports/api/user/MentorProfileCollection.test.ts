import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import { removeAllEntities } from '../base/BaseUtilities';
import { MentorProfiles } from './MentorProfileCollection';
import { makeSampleInterestArray } from '../interest/SampleInterests';
import { makeSampleCareerGoalSlugArray } from '../career/SampleCareerGoals';
import { FavoriteInterests } from '../favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../favorite/FavoriteCareerGoalCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('MentorProfileCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) { // Test the define and removeIt methods
      this.timeout(25000);
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(1), fc.lorem(1), fc.lorem(1), fc.lorem(1), fc.lorem(3), fc.lorem(2), fc.lorem(2), fc.lorem(1), fc.lorem(10),
          (username, firstName, lastName, picture, website, company, career, location, linkedin, motivation) => {
          const interests = makeSampleInterestArray();
          const careerGoals = makeSampleCareerGoalSlugArray();
          const docID = MentorProfiles.define({
            username, firstName, lastName, picture, website, interests,
            careerGoals, company, career, location, linkedin, motivation,
          });
            expect(MentorProfiles.isDefined(docID)).to.be.true;
            expect(FavoriteInterests.count()).to.equal(interests.length);
            expect(FavoriteCareerGoals.count()).to.equal(careerGoals.length);
            MentorProfiles.removeIt(docID);
            expect(MentorProfiles.isDefined(docID)).to.be.false;
            expect(FavoriteInterests.count()).to.equal(0);
            expect(FavoriteCareerGoals.count()).to.equal(0);
          }),
      );
      done();
    });


    it('#define, #isDefined, #update, #removeIt, #dumpOne, #restoreOne', function test() {
      const username = 'rbrewer@tableau.com';
      const firstName = 'Robert';
      const lastName = 'Brewer';
      const picture = 'foo.jpg';
      const website = 'http://rbrewer.github.io';
      const interests = [];
      const careerGoals = [];
      const company = 'Tableau Inc';
      const career = 'Software Engineer';
      const location = 'San Francisco, CA';
      const linkedin = 'robertsbrewer';
      const motivation = 'Help future students.';
      const docID = MentorProfiles.define({
        username, firstName, lastName, picture, website, interests,
        careerGoals, company, career, location, linkedin, motivation,
      });
      expect(MentorProfiles.isDefined(docID)).to.be.true;
      const dumpObject = MentorProfiles.dumpOne(docID);
      MentorProfiles.removeIt(docID);
      expect(MentorProfiles.isDefined(docID)).to.be.false;
      MentorProfiles.restoreOne(dumpObject);
      const id = MentorProfiles.getID(username);
      expect(MentorProfiles.isDefined(id)).to.be.true;
      MentorProfiles.removeIt(id);
    });
  });
}
