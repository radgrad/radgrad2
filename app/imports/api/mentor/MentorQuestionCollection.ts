import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { MentorAnswers } from './MentorAnswerCollection';
import { ROLE } from '../role/Role';
import { Slugs } from '../slug/SlugCollection';
import { Users } from '../user/UserCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';

/**
 * Represents a mentor answer.
 * @extends api/base.BaseSlugCollection
 * @memberOf api/mentor
 */
class MentorQuestionCollection extends BaseSlugCollection {
  /**
   * Creates the Mentor Question collection.
   */
  constructor() {
    super('MentorQuestion', new SimpleSchema({
      question: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id, optional: true },
      studentID: { type: SimpleSchema.RegEx.Id },
      moderated: { type: Boolean },
      visible: { type: Boolean },
      moderatorComments: { type: String, optional: true },
    }));
  }

  /**
   * Defines a new MentorSpace question.
   * @param question the question.
   * @param slug A unique identifier for this question.
   * @param student The student that asked this question.
   * @param moderated If the question is moderated. Defaults to false.
   * @param visible If the question is visible. Defaults to false.
   * @param moderatorComments any comments from the moderator.
   * @return { String } the docID of this question.
   */
  public define({ question, slug, student, moderated = false, visible = false, moderatorComments = '' }:
                  {
                    question: string;
                    slug: string;
                    student: string;
                    moderated?: boolean;
                    visible?: boolean;
                    moderatorComments?: string
                  }) {
    const studentID = Users.getID(student);
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    const docID = this.collection.insert({ question, slugID, studentID, moderated, visible, moderatorComments });
    Slugs.updateEntityID(slugID, docID);
    return docID;
  }

  /**
   * Updates the moderator question.
   * @param instance the id or slug (required).
   * @param question the question (optional).
   * @param student the student's id or username (optional).
   * @param moderated boolean (optional).
   * @param visible boolean (optional).
   * @param moderatorComments string (optional).
   */
  public update(instance: string, { question, student, moderated, visible, moderatorComments }:
    { question?: string; student?: string; moderated?: boolean; visible?: boolean; moderatorComments?: string; }) {
    const docID = this.getID(instance);
    const updateData: {
      question?: string;
      studentID?: string;
      moderated?: boolean;
      visible?: boolean;
      moderatorComments?: string;
    } = {};
    if (question) {
      updateData.question = question;
    }
    if (student) {
      updateData.studentID = Users.getID(student);
    }
    if (_.isBoolean(moderated)) {
      updateData.moderated = moderated;
    }
    if (_.isBoolean(visible)) {
      updateData.visible = visible;
    }
    if (moderatorComments) {
      updateData.moderatorComments = moderatorComments;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the course instance.
   * @param docID The docID of the course instance.
   */
  public removeIt(docID: string) {
    this.assertDefined(docID);
    // remove the Answers associated with this question
    MentorAnswers.removeQuestion(docID);
    // OK, clear to delete.
    return super.removeIt(docID);
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin, Advisor or
   * Student.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  public assertValidRoleForMethod(userId: string) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT]);
  }

  public getQuestions() {
    return this.collection.find({}).fetch().reverse();
  }

  /**
   * Checks to see that slugID and studentID are defined.
   * @returns {Array} An array of error message(s) if either are not defined.
   */
  public checkIntegrity(): string[] {
    const problems = [];
    this.find().forEach((doc) => {
      if (doc.slugID) {
        if (!Slugs.isDefined(doc.slugID)) {
          problems.push(`Bad slugID: ${doc.slugID}`);
        }
      }
      if (!Users.isDefined(doc.studentID)) {
        problems.push(`Bad studentID: ${doc.studentID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the MentorQuestion docID in a format acceptable to define().
   * @param docID The docID of a MentorQuestion.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string) {
    const doc = this.findDoc(docID);
    const question = doc.question;
    let slug;
    if (doc.slugID) {
      slug = Slugs.getNameFromID(doc.slugID);
    }
    const student = Users.getProfile(doc.studentID).username;
    const moderated = doc.moderated;
    const visible = doc.visible;
    const moderatorComments = doc.moderatorComments;
    return { question, slug, student, moderated, visible, moderatorComments };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/mentor.MentorQuestionCollection}
 * @memberOf api/mentor
 */
export const MentorQuestions = new MentorQuestionCollection();
