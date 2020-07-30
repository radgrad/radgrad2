import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import 'mocha';
import fc from 'fast-check';
import faker from 'faker';
import { removeAllEntities } from '../base/BaseUtilities';
import { MentorAnswers } from './MentorAnswerCollection';
import { MentorQuestions } from './MentorQuestionCollection';
import { makeSampleUser } from '../user/SampleUsers';
import { ROLE } from '../role/Role';
import { makeSampleMentorQuestion } from './SampleMentorQuestionAndAnswer';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('MentorAnswerCollection', function testSuite() {
    // Define course data.
    const questionSlug = 'hiring-expectations';
    let text = 'Test answer.';

    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(50000);
      fc.assert(
        fc.property(fc.lorem(10), fc.boolean(), (fcText, fcRetired) => {
          const mentor = makeSampleUser(ROLE.MENTOR);
          const question = makeSampleMentorQuestion();
          const docID = MentorAnswers.define({ question, mentor, text: fcText, retired: fcRetired });
          expect(MentorAnswers.isDefined(docID)).to.be.true;
          const doc = MentorAnswers.findDoc(docID);
          expect(doc.questionID).to.equal(question);
          expect(doc.mentorID).to.equal(mentor);
          expect(doc.text).to.equal(fcText);
          expect(doc.retired).to.equal(fcRetired);
          MentorAnswers.removeIt(docID);
          expect(MentorAnswers.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Can update', function test2(done) {
      this.timeout(50000);
      text = faker.lorem.words();
      const mentor = makeSampleUser(ROLE.MENTOR);
      const question = makeSampleMentorQuestion();
      const docID = MentorAnswers.define({ question, mentor, text });
      let doc = MentorAnswers.findDoc(docID);
      fc.assert(
        fc.property(fc.lorem(24), fc.boolean(), (fcText, fcRetired) => {
          MentorAnswers.update(docID, { text: fcText, retired: fcRetired });
          doc = MentorAnswers.findDoc(docID);
          expect(doc.text).to.equal(fcText);
          expect(doc.retired).to.equal(fcRetired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test3() {
      let doc = MentorAnswers.findOne({});
      let docID = doc._id;
      const dumpObject = MentorAnswers.dumpOne(docID);
      MentorAnswers.removeIt(docID);
      expect(MentorAnswers.isDefined(docID)).to.be.false;
      docID = MentorAnswers.restoreOne(dumpObject);
      doc = MentorAnswers.findDoc(docID);
      expect(doc.retired).to.equal(dumpObject.retired);
      expect(doc.text).to.equal(dumpObject.text);
    });

    it('Can check integrity no errors', function test4() {
      const problems = MentorAnswers.checkIntegrity();
      expect(problems.length).to.equal(0);
    });

    it('Can removeQuestion and removeUser', function test() {
      // Define mentor and the question.
      const mentor1 = makeSampleUser(ROLE.MENTOR);
      const mentor2 = makeSampleUser(ROLE.MENTOR);
      const student = makeSampleUser(ROLE.STUDENT);
      MentorQuestions.define({ question: 'Sample Question', slug: `${questionSlug}-1`, student });
      MentorQuestions.define({ question: 'Sample Question2', slug: `${questionSlug}-2`, student });
      const answer11ID = MentorAnswers.define({ question: `${questionSlug}-1`, mentor: mentor1, text });
      const answer21ID = MentorAnswers.define({ question: `${questionSlug}-1`, mentor: mentor2, text });
      const answer12ID = MentorAnswers.define({ question: `${questionSlug}-2`, mentor: mentor1, text });
      const answer22ID = MentorAnswers.define({ question: `${questionSlug}-2`, mentor: mentor2, text });
      expect(MentorAnswers.isDefined(answer11ID)).to.be.true;
      expect(MentorAnswers.isDefined(answer21ID)).to.be.true;
      expect(MentorAnswers.isDefined(answer12ID)).to.be.true;
      expect(MentorAnswers.isDefined(answer22ID)).to.be.true;
      MentorAnswers.removeQuestion(`${questionSlug}-1`);
      expect(MentorAnswers.isDefined(answer11ID)).to.be.false;
      expect(MentorAnswers.isDefined(answer21ID)).to.be.false;
      MentorAnswers.removeUser(mentor2);
      expect(MentorAnswers.isDefined(answer12ID)).to.be.true;
      expect(MentorAnswers.isDefined(answer22ID)).to.be.false;
    });
  });
}
