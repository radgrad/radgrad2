import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import 'mocha';
import moment from 'moment';
import { removeAllEntities } from '../base/BaseUtilities';
import { MentorQuestions } from './MentorQuestionCollection';
import { makeSampleUser } from '../user/SampleUsers';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('MentorQuestionCollection', function testSuite() {
    let question: string;
    let slug: string;
    let student: string;

    before(function setup() {
      removeAllEntities();
      question = 'Test question.';
      slug = 'test-mentor-question';
      student = makeSampleUser();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(50000);
      fc.assert(
        fc.property(fc.lorem(12), fc.lorem(1), fc.boolean(), (fcQuestion, fcSlug, fcRetired) => {
          student = makeSampleUser();
          const docID = MentorQuestions.define({ question: fcQuestion, slug: fcSlug, student });
          expect(MentorQuestions.isDefined(docID)).to.be.true;
          const doc = MentorQuestions.findDoc(docID);
          expect(doc.question).to.equal(fcQuestion);
          expect(doc.studentID).to.equal(student);
          MentorQuestions.removeIt(docID);
          expect(MentorQuestions.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Can update', function test2(done) {
      this.timeout(50000);
      question = faker.lorem.paragraph();
      slug = `${student}-question-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`;
      const docID = MentorQuestions.define({ question, slug, student });
      let doc = MentorQuestions.findDoc(docID);
      fc.assert(
        fc.property(fc.lorem(12), fc.boolean(), (fcQuestion, fcRetired) => {
          MentorQuestions.update(docID, { question: fcQuestion, retired: fcRetired });
          doc = MentorQuestions.findDoc(docID);
          expect(doc.question).to.equal(fcQuestion);
          expect(doc.retired).to.equal(fcRetired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test3() {
      let doc = MentorQuestions.findOne({});
      let docID = doc._id;
      const dumpObject = MentorQuestions.dumpOne(docID);
      MentorQuestions.removeIt(docID);
      expect(MentorQuestions.isDefined(docID)).to.be.false;
      docID = MentorQuestions.restoreOne(dumpObject);
      doc = MentorQuestions.findDoc(docID);
      expect(doc.question).to.equal(dumpObject.question);
      expect(doc.retired).to.equal(dumpObject.retired);
    });

    it('Can check integrity no errors', function test4() {
      const problems = MentorQuestions.checkIntegrity();
      expect(problems.length).to.equal(0);
    });
  });
}
