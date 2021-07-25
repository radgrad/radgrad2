import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import { CareerGoalKeywordDefine, CareerGoalKeywordUpdate } from '../../typings/radgrad';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';
import { CareerGoals } from './CareerGoalCollection';

/**
 * Mapping between career goals and keywords.
 */
class CareerGoalKeywordCollection extends BaseCollection {
  /** Creates the CareerGoalKeywordCollection. */
  constructor() {
    super(
      'CareerGoalKeyword',
      new SimpleSchema({
        careerGoalID: SimpleSchema.RegEx.Id,
        keyword: String,
        retired: { type: Boolean, optional: true },
      }),
    );
  }

  /**
   * Defines a new career goal keyword mapping.
   * @param {string} careerGoal the careerGoal slug or id.
   * @param {string} keyword the keyword.
   * @param {boolean | undefined} retired optional.
   * @return {string}
   */
  define({ careerGoal, keyword, retired = false }: CareerGoalKeywordDefine): string {
    const careerGoalID = CareerGoals.getID(careerGoal);
    const doc = this.findOne({ careerGoalID, keyword });
    if (doc) {
      return doc._id;
    }
    return this.collection.insert({ careerGoalID, keyword, retired });
  }

  /**
   * Updates the given career goal keyword pair.
   * @param docID the id of the pair.
   * @param {string | undefined} keyword the new keyword, optional.
   * @param {boolean | undefined} retired the retired status, optional.
   */
  update(docID, { keyword, retired }: CareerGoalKeywordUpdate) {
    this.assertDefined(docID);
    const updateData: CareerGoalKeywordUpdate = {};
    if (keyword) {
      updateData.keyword = keyword;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Removes the pair.
   * @param {string | {[p: string]: unknown}} docID the id of the pair.
   * @return {boolean}
   */
  removeIt(docID): boolean {
    this.assertDefined(docID);
    return super.removeIt(docID);
  }

  /**
   * Removes all the pairs for the given career goal.
   * @param {string} careerGoal the careerGoal slug or id.
   */
  removeCareerGoal(careerGoal: string) {
    const careerGoalID = CareerGoals.getID(careerGoal);
    this.collection.remove({ careerGoalID });
  }

  /**
   * Removes all the pairs for the given keyword.
   * @param {string} keyword the keyword.
   */
  removeKeyword(keyword: string) {
    this.collection.remove({ keyword });
  }

  /**
   * Returns the keywords associated with the give careerGoal.
   * @param careerGoal the careerGoal slug or id.
   * @return {string[]}
   */
  getKeywords(careerGoal: string) {
    const careerGoalID = CareerGoals.getID(careerGoal);
    return this.collection.find({ careerGoalID }).fetch().map((ik) => ik.keyword);
  }

  /**
   * Returns the careerGoal slugs associated with the given keyword.
   * @param {string} keyword the keyword.
   * @return {string[]} the careerGoal slugs.
   */
  getcareerGoalSlugs(keyword: string) {
    const docs = this.collection.find({ keyword }).fetch();
    return docs.map(doc => CareerGoals.findSlugByID(doc.careerGoalID));
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin, Advisor or Student.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY]);
  }

  /**
   * Checks the careerGoalIDs.
   * @return {any[]}
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach((doc) => {
      if (!CareerGoals.isDefined(doc.careerGoalID)) {
        problems.push(`Bad careerGoalID ${doc.careerGoalID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object for the CareerGoalKeyword docID in a format acceptable to define().
   * @param docID the id of the pair.
   * @return {CareerGoalKeywordDefine}
   */
  dumpOne(docID): CareerGoalKeywordDefine {
    const doc = this.findDoc(docID);
    const careerGoal = CareerGoals.findSlugByID(doc.careerGoalID);
    const keyword = doc.keyword;
    const retired = doc.retired;
    return { careerGoal, keyword, retired };
  }
}

export const CareerGoalKeywords = new CareerGoalKeywordCollection();
