import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import { InterestKeywordDefine, InterestKeywordUpdate } from '../../typings/radgrad';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';
import { Interests } from './InterestCollection';

/**
 * Mapping between interests and keywords.
 */
class InterestKeywordCollection extends BaseCollection {
  /** Creates the InterestKeywordCollection. */
  constructor() {
    super(
      'InterestKeyword',
      new SimpleSchema({
        interestID: SimpleSchema.RegEx.Id,
        keyword: String,
        retired: { type: Boolean, optional: true },
      }),
    );
  }

  /**
   * Defines a new interest keyword mapping.
   * @param {string} interest the interest slug or id.
   * @param {string} keyword the keyword.
   * @param {boolean | undefined} retired optional.
   * @return {string}
   */
  define({ interest, keyword, retired = false }: InterestKeywordDefine): string {
    const interestID = Interests.getID(interest);
    const doc = this.findOne({ interestID, keyword });
    if (doc) {
      return doc._id;
    }
    return this.collection.insert({ interestID, keyword, retired });
  }

  /**
   * Updates the given interest keyword pair.
   * @param docID the id of the pair.
   * @param {string | undefined} keyword the new keyword, optional.
   * @param {boolean | undefined} retired the retired status, optional.
   */
  update(docID, { keyword, retired }: InterestKeywordUpdate) {
    this.assertDefined(docID);
    const updateData: InterestKeywordUpdate = {};
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
   * @param {string} docID the id of the pair.
   * @return {boolean}
   */
  removeIt(docID): boolean {
    this.assertDefined(docID);
    return super.removeIt(docID);
  }

  /**
   * Removes all the pairs for the given interest.
   * @param {string} interest the interest slug or id.
   */
  removeInterest(interest: string) {
    const interestID = Interests.getID(interest);
    this.collection.remove({ interestID });
  }

  /**
   * Removes all the pairs for the given keyword.
   * @param {string} keyword the keyword.
   */
  removeKeyword(keyword: string) {
    this.collection.remove({ keyword });
  }

  /**
   * Returns the keywords associated with the give interest.
   * @param interest the interest slug or id.
   * @return {string[]}
   */
  getKeywords(interest: string) {
    const interestID = Interests.getID(interest);
    return this.collection.find({ interestID }).fetch().map((ik) => ik.keyword);
  }

  /**
   * Returns the unique keywords in this collection.
   * @return {string[]}
   */
  getUniqueKeywords() {
    const keywords = this.collection.find({}).fetch().map(ik => ik.keyword);
    return _.uniq(keywords);
  }

  /**
   * Returns the interest slugs associated with the given keyword.
   * @param {string} keyword the keyword.
   * @return {string[]} the interest slugs.
   */
  getInterestSlugs(keyword: string) {
    const docs = this.collection.find({ keyword }).fetch();
    return docs.map(doc => Interests.findSlugByID(doc.interestID));
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
   * Checks the interestIDs.
   * @return {any[]}
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach((doc) => {
      if (!Interests.isDefined(doc.interestID)) {
        problems.push(`Bad InterestID ${doc.interestID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object for the InterestKeyword docID in a format acceptable to define().
   * @param docID the id of the pair.
   * @return {InterestKeywordDefine}
   */
  dumpOne(docID): InterestKeywordDefine {
    const doc = this.findDoc(docID);
    const interest = Interests.findSlugByID(doc.interestID);
    const keyword = doc.keyword;
    const retired = doc.retired;
    return { interest, keyword, retired };
  }
}

export const InterestKeywords = new InterestKeywordCollection();
