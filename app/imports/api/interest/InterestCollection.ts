import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { Slugs } from '../slug/SlugCollection';
import { InterestTypes } from './InterestTypeCollection';
import { Courses } from '../course/CourseCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { Teasers } from '../teaser/TeaserCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { IInterestDefine, IInterestUpdate } from '../../typings/radgrad';

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
    }));
    this.defineSchema = new SimpleSchema({
      name: String,
      slug: String,
      description: String,
      interestType: String,
      retired: { type: Boolean, optional: true },
    });
    this.updateSchema = new SimpleSchema({
      name: { type: String, optional: true },
      slug: { type: String, optional: true },
      description: { type: String, optional: true },
      interestType: { type: String, optional: true },
      retired: { type: Boolean, optional: true },
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
  public define({ name, slug, description, interestType, retired = false }: IInterestDefine): string {
    // console.log(`${this.collectionName}.define(${name}, ${slug}, ${description}, ${interestType}`);
    // Get InterestTypeID, throw error if not found.
    const interestTypeID = InterestTypes.getID(interestType);
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    // Define the Interest and get its ID
    const interestID = this.collection.insert({ name, description, slugID, interestTypeID, retired });
    // Connect the Slug to this Interest
    Slugs.updateEntityID(slugID, interestID);
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
  public update(docID: string, { name, description, interestType, retired }: IInterestUpdate) {
    this.assertDefined(docID);
    const updateData: { name?: string, description?: string, interestTypeID?: string, retired?: boolean } = {};
    if (name) {
      updateData.name = name;
    }
    if (description) {
      updateData.description = description;
    }
    if (interestType) {
      const interestTypeID = InterestTypes.getID(interestType);
      updateData.interestTypeID = interestTypeID;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this.collection.update(docID, { $set: updateData });
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
    _.forEach(collectionList, (collection) => {
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
    // Check that this interest is not referenced by any User.
    // TODO Should the profile collections be included below?
    // No, but we need to check FavoriteInterests
    this.assertUnusedInterest([Courses, CareerGoals, Opportunities, Teasers], docID);
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
  public dumpOne(docID): IInterestDefine {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const slug = Slugs.getNameFromID(doc.slugID);
    const description = doc.description;
    const interestType = InterestTypes.findSlugByID(doc.interestTypeID);
    const retired = doc.retired;
    return { name, slug, description, interestType, retired };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/interest.InterestCollection}
 * @memberOf api/interest
 */
export const Interests = new InterestCollection();
