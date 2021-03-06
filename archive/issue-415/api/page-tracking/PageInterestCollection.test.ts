import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import { removeAllEntities } from '../../../../app/imports/api/base/BaseUtilities';
import 'mocha';
import { PageInterests } from './PageInterestCollection';
import { makeSampleUser } from '../../../../app/imports/api/user/SampleUsers';
import { Users } from '../../../../app/imports/api/user/UserCollection';
import {
  PageInterest,
  PageInterestDefine,
} from '../../../../app/imports/typings/radgrad';
import { makeSamplePageInterest } from './SamplePageInterests';

/* eslint @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('PageInterestCollection', function testSuite() {
    let username;

    before(function setup() {
      removeAllEntities();
      const userID = makeSampleUser();
      username = Users.getProfile(userID).username;
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(1), (fcCategory, fcName) => {
          const docID = PageInterests.define({ username, category: fcCategory, name: fcName });

          expect(PageInterests.isDefined(docID)).to.be.true;
          PageInterests.removeIt(docID);
          expect(PageInterests.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Cannot define duplicates', function test2() {
      const category = faker.lorem.word();
      const name = faker.lorem.slug();
      const docID1 = PageInterests.define({ username, category, name });
      const docID1Object: PageInterest = PageInterests.findOne({ _id: docID1 });
      const docID1Timestamp: Date = docID1Object.timestamp;
      const docID2 = PageInterests.define({ username, category, name, timestamp: docID1Timestamp });

      expect(docID1).to.equal(docID2);
      expect(PageInterests.isDefined(docID1)).to.be.true;
      PageInterests.removeIt(docID2);
      expect(PageInterests.isDefined(docID1)).to.be.false;
    });

    it('Can dumpOne, removeIt, and restoreOne', function test3() {
      let docID = makeSamplePageInterest();
      const original: PageInterest = PageInterests.findDoc(docID);
      const dumpObject: PageInterestDefine = PageInterests.dumpOne(docID);
      PageInterests.removeIt(docID);
      expect(PageInterests.isDefined(docID)).to.be.false;
      docID = PageInterests.restoreOne(dumpObject);
      expect(PageInterests.isDefined(docID)).to.be.true;
      const restored: PageInterest = PageInterests.findDoc(docID);

      expect(original.username).to.deep.equal(restored.username);
      expect(original.category).to.deep.equal(restored.category);
      expect(original.name).to.deep.equal(restored.name);
      expect(original.timestamp).to.deep.equal(restored.timestamp);
      expect(original.retired).to.deep.equal(restored.retired);

    });

    it('Can checkIntegrity no errors', function test4() {
      const problems = PageInterests.checkIntegrity();

      // When we call makeSamplePageInterest, we don't create the random slugs (category and name) that it generates
      expect(problems.length).to.equal(2);
    });
  });
}
