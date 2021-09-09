import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { Internships } from '../internship/InternshipCollection';
import { Slugs } from '../slug/SlugCollection';
import { ProfileInterests } from '../user/profile-entries/ProfileInterestCollection';
import { InterestKeywords } from './InterestKeywordCollection';
import { InterestTypes } from './InterestTypeCollection';
import { Courses } from '../course/CourseCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { Teasers } from '../teaser/TeaserCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { CareerGoal, Course, InterestDefine, InterestUpdate, Internship, Opportunity } from '../../typings/radgrad';

/**
 * Represents a specific interest, such as "Software Engineering".
 * Note that all Interests must have an associated InterestType.
 * @extends api/base.BaseSlugCollection
 * @memberOf api/interest
 */
class InterestCollection extends BaseSlugCollection {

  /**
   * Creates the Interest collection.
   */
  constructor() {
    super('Interest', new SimpleSchema({
      name: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      description: { type: String },
      interestTypeID: { type: SimpleSchema.RegEx.Id },
      retired: { type: Boolean, optional: true },
      picture: { type: String, optional: true, defaultValue: 'images/header-panel/header-interests.png' },
    }));
    this.defineSchema = new SimpleSchema({
      name: String,
      slug: String,
      description: String,
      interestType: String,
      retired: { type: Boolean, optional: true },
      picture: { type: String, optional: true },
      keywords: { type: Array },
      'keywords.$': { type: String },
    });
    this.updateSchema = new SimpleSchema({
      name: { type: String, optional: true },
      slug: { type: String, optional: true },
      description: { type: String, optional: true },
      interestType: { type: String, optional: true },
      retired: { type: Boolean, optional: true },
      picture: { type: String, optional: true },
      keywords: { type: Array, optional: true },
      'keywords.$': { type: String },
    });
  }

  /**
   * Defines a new Interest and its associated Slug.
   * @example
   * Interests.define({ name: 'Software Engineering',
   *                    slug: 'software-engineering',
   *                    description: 'Methods for group development of large, high quality software systems',
   *                    interestType: 'cs-disciplines' });
   * @param { Object } description Object with keys name, slug, description, interestType.
   * Slug must be previously undefined.
   * InterestType must be an InterestType slug or ID.
   * @throws {Meteor.Error} If the interest definition includes a defined slug or undefined interestType.
   * @returns The newly created docID.
   */
  public define({ name, slug, description, interestType, retired = false, picture, keywords = [] }: InterestDefine): string {
    // console.log(`${this.collectionName}.define(${name}, ${slug}, ${description}, ${interestType}`);
    // Get InterestTypeID, throw error if not found.
    const interestTypeID = InterestTypes.getID(interestType);
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    // Define the Interest and get its ID
    const interestID = this.collection.insert({ name, description, slugID, interestTypeID, retired, picture });
    // Connect the Slug to this Interest
    Slugs.updateEntityID(slugID, interestID);
    // Update the InterestKeywords
    if (keywords.length > 0) {
      InterestKeywords.removeInterest(interestID);
      keywords.forEach((word) => InterestKeywords.define({ interest: slug, keyword: word, retired }));
    }
    return interestID;
  }

  /**
   * Update an Interest.
   * @param docID The docID to be updated.
   * @param name The new name (optional).
   * @param description The new description (optional).
   * @param interestType The new interestType slug or ID (optional).
   * @throws { Meteor.Error } If docID is not defined, or if interestType is not valid.
   */
  public update(docID: string, { name, description, interestType, retired, picture, keywords }: InterestUpdate) {
    this.assertDefined(docID);
    const updateData: { name?: string, description?: string, interestTypeID?: string, retired?: boolean, picture?:string } = {};
    if (name) {
      updateData.name = name;
    }
    if (description) {
      updateData.description = description;
    }
    if (picture) {
      updateData.picture = picture;
    }
    if (interestType) {
      const interestTypeID = InterestTypes.getID(interestType);
      updateData.interestTypeID = interestTypeID;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
      const profileInterests = ProfileInterests.find({ interestID: docID }).fetch();
      profileInterests.forEach((pi) => ProfileInterests.update(pi._id, { retired }));
      const interest = this.findDoc(docID);
      const teasers = Teasers.find({ targetSlugID: interest.slugID }).fetch();
      teasers.forEach((teaser) => Teasers.update(teaser._id, { retired }));
    }
    this.collection.update(docID, { $set: updateData });
    if (keywords) {
      InterestKeywords.removeInterest(docID);
      const interestDoc = this.findDoc(docID);
      const interest = Slugs.getNameFromID(interestDoc.slugID);
      keywords.forEach(word => InterestKeywords.define({ interest, keyword: word }));
    }
    return true;
  }

  /**
   * Throws an error if docID (an interest) is referenced in any of the passed collections.
   * @param collectionList A list of collection class instances.
   * @param docID The docID of an interest.
   * @throws { Meteor.Error } If the interest is referenced in any of the collections.
   */
  public assertUnusedInterest(collectionList, docID: string) {
    const interest = this.findDoc(docID);
    collectionList.forEach((collection) => {
      collection.find().map((doc) => {
        if (collection.hasInterest(doc, docID)) {
          throw new Meteor.Error(`Interest ${interest.name} is referenced by collection ${collection.collectionName}.`);
        }
        return true;
      });
    });
  }

  /**
   * Remove the Interest.
   * @param instance The docID or slug of the entity to be removed.
   * @throws { Meteor.Error } If Interest is associated with any User, Course, Career Goal, or Opportunity.
   */
  public removeIt(instance: string) {
    const docID = this.getID(instance);
    // Remove any InterestKeywords
    InterestKeywords.removeInterest(docID);
    // Check that this interest is not referenced by any User.
    this.assertUnusedInterest([Courses, CareerGoals, Opportunities, Teasers], docID);
    // Remove any ProfileInterests for this interest.
    const profileInterests = ProfileInterests.find({ interestID: docID }).fetch();
    profileInterests.forEach(pi => ProfileInterests.removeIt(pi._id));
    // OK, clear to delete.
    return super.removeIt(docID);
  }

  /**
   * Returns a list of Interest names corresponding to the passed list of Interest docIDs.
   * @param instanceIDs A list of Interest docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  public findNames(instanceIDs: string[]) {
    // console.log('Interests.findNames(%o)', instanceIDs);
    return instanceIDs.map((instanceID) => this.findDoc(instanceID).name);
  }

  /**
   * Returns a list of the CareerGoals that have the given interest.
   * @param {string} docIdOrSlug an interest ID or slug.
   * @return {CareerGoal[]} CareerGoals that have the given interest.
   */
  public findRelatedCareerGoals(docIdOrSlug: string): CareerGoal[] {
    const interestID = this.getID(docIdOrSlug);
    const careerGoals = CareerGoals.findNonRetired();
    return careerGoals.filter((goal) => goal.interestIDs.includes(interestID));
  }

  /**
   * Returns a list of Courses that have the given interest.
   * @param {string} docIdOrSlug an interest ID or slug.
   * @return {Course[]} Courses that have the given interest.
   */
  public findRelatedCourses(docIdOrSlug: string): Course[] {
    const interestID = this.getID(docIdOrSlug);
    const courses = Courses.findNonRetired();
    return courses.filter((course) => course.interestIDs.includes(interestID));
  }

  /**
   * Returns a list of Internships that have the given interest.
   * @param {string} docIdOrSlug an interest ID or slug.
   * @return {Internship[]} Internships that have the given interest.
   */
  public findRelatedInternships(docIdOrSlug: string): Internship[] {
    const interestID = this.getID(docIdOrSlug);
    const internships = Internships.findNonRetired();
    return internships.filter((internship) => internship.interestIDs.includes(interestID));
  }

  /**
   * Returns a list of the Opportunities that have the given interest.
   * @param {string} docIdOrSlug an interest ID or slug.
   * @return {Opportunity[]} Opportunities that have the given interest.
   */
  public findRelatedOpportunities(docIdOrSlug: string): Opportunity[] {
    const interestID = this.getID(docIdOrSlug);
    const opportunities = Opportunities.findNonRetired();
    return opportunities.filter((opp) => opp.interestIDs.includes(interestID));
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID and interestTypeID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity() {
    const problems = [];
    this.find({}, {}).forEach((doc) => {
      if (!Slugs.isDefined(doc.slugID)) {
        problems.push(`Bad slugID: ${doc.slugID}`);
      }
      if (!InterestTypes.isDefined(doc.interestTypeID)) {
        problems.push(`Bad interestTypeID: ${doc.interestTypeID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the Interest docID in a format acceptable to define().
   * @param docID The docID of an Interest.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID): InterestDefine {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const slug = Slugs.getNameFromID(doc.slugID);
    const description = doc.description;
    const picture = doc.picture;
    const interestType = InterestTypes.findSlugByID(doc.interestTypeID);
    const retired = doc.retired;
    const keywords = InterestKeywords.getKeywords(slug);
    return { name, slug, description, interestType, retired, picture, keywords };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/interest.InterestCollection}
 * @memberOf api/interest
 */
export const Interests = new InterestCollection();
