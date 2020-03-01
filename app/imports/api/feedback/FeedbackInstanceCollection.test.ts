import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import {} from 'mocha';
import { FeedbackInstances } from './FeedbackInstanceCollection';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FeedbackInstanceCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(5000);
      fc.assert(
        fc.property(fc.lorem(5), fc.lorem(20), fc.nat(FeedbackInstances.feedbackTypes.length - 1), fc.boolean(), (functionName, description, typeIndex, retired) => {
          const userID = makeSampleUser();
          const feedbackType = FeedbackInstances.feedbackTypes[typeIndex];
          const docID = FeedbackInstances.define({ user: userID, functionName, description, feedbackType, retired });
          expect(FeedbackInstances.isDefined(docID)).to.be.true;
          FeedbackInstances.removeIt(docID);
          expect(FeedbackInstances.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Cannot define duplicates', function test2() {
      const user = makeSampleUser();
      const functionName = faker.lorem.words();
      const description = faker.lorem.paragraph();
      const feedbackType = FeedbackInstances.feedbackTypes[0];
      const docID1 = FeedbackInstances.define({ user, functionName, description, feedbackType });
      const docID2 = FeedbackInstances.define({ user, functionName, description, feedbackType });
      expect(docID1).to.equal(docID2);
      expect(FeedbackInstances.isDefined(docID1)).to.be.true;
      FeedbackInstances.removeIt(docID2);
      expect(FeedbackInstances.isDefined(docID1)).to.be.false;
    });

    it('Can update', function test3(done) {
      this.timeout(5000);
      const user = makeSampleUser();
      const functionName = faker.lorem.words();
      const description = faker.lorem.paragraph();
      const feedbackType = FeedbackInstances.feedbackTypes[0];
      const docID = FeedbackInstances.define({ user, functionName, description, feedbackType });
      fc.assert(
        fc.property(fc.lorem(5), fc.lorem(20), fc.nat(FeedbackInstances.feedbackTypes.length - 1), fc.boolean(), (funcName, descrip, typeIndex, retired) => {
          const newUser = makeSampleUser();
          const newFeedbackType = FeedbackInstances.feedbackTypes[typeIndex];
          FeedbackInstances.update(docID, { user: newUser, description: descrip, functionName: funcName, feedbackType: newFeedbackType, retired });
          const fi = FeedbackInstances.findDoc(docID);
          expect(fi.userID).to.equal(newUser);
          expect(fi.description).to.equal(descrip);
          expect(fi.functionName).to.equal(funcName);
          expect(fi.feedbackType).to.equal(newFeedbackType);
          expect(fi.retired).to.equal(retired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let fi = FeedbackInstances.findOne({});
      let docID = fi._id;
      const dumpObject = FeedbackInstances.dumpOne(docID);
      FeedbackInstances.removeIt(docID);
      expect(FeedbackInstances.isDefined(docID)).to.be.false;
      docID = FeedbackInstances.restoreOne(dumpObject);
      expect(FeedbackInstances.isDefined(docID)).to.be.true;
      fi = FeedbackInstances.findDoc(docID);
      expect(fi.description).to.equal(dumpObject.description);
      expect(fi.functionName).to.equal(dumpObject.functionName);
      expect(fi.feedbackType).to.equal(dumpObject.feedbackType);
      expect(fi.retired).to.equal(dumpObject.retired);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = FeedbackInstances.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });

    it('Can clear', function test6() {
      const user = makeSampleUser();
      const functionName = 'checkPrerequisites';
      const description = 'The prereqs for ICS 314 were not satisfied.';
      const feedbackType = FeedbackInstances.RECOMMENDATION;
      const docID = FeedbackInstances.define({ user, functionName, description, feedbackType });
      expect(FeedbackInstances.isDefined(docID)).to.be.true;
      FeedbackInstances.clear(user, functionName);
      expect(FeedbackInstances.isDefined(docID)).to.be.false;
    });
  });
}
