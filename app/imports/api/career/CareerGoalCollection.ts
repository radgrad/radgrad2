import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Slugs } from '../slug/SlugCollection';
import { Users } from '../user/UserCollection';
import { Interests } from '../interest/InterestCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { ICareerGoalDefine, ICareerGoalUpdate } from '../../typings/radgrad';

/**
 * CareerGoals represent the professional future(s) that the student wishes to work toward.
 * @memberOf api/career
 * @extends api/base.BaseSlugCollection
 */
class CareerGoalCollection extends BaseSlugCollection {

  /**
   * Creates the CareerGoal collection.
   */
  constructor() {
    super('CareerGoal', new SimpleSchema({
      name: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      description: { type: String },
      interestIDs: [SimpleSchema.RegEx.Id],
      retired: { type: Boolean, optional: true },
    }));
    this.defineSchema = new SimpleSchema({
      name: { type: String },
      slug: { type: String },
      description: { type: String },
      interests: [String],
    });
    // name, description, interests
    this.updateSchema = new SimpleSchema({
      'name': { type: String, optional: true },
      'description': { type: String, optional: true },
      'interests': { type: Array, optional: true },
      'interests.$': String,
      'retired': { type: Boolean, optional: true },
    });
  }

  /**
   * Defines a new CareerGoal with its name, slug, and description.
   * @example
   * CareerGoals.define({ name: 'Database Administrator',
   *                      slug: 'database-administrator',
   *                      description: 'Wrangler of SQL.',
   *                      interests: ['application-development', 'software-engineering', 'databases'],
   *                    });
   * @param { Object } description Object with keys name, slug, description, interests.
   * Slug must be globally unique and previously undefined.
   * Interests is a (possibly empty) array of defined interest slugs or interestIDs.
   * @throws { Meteor.Error } If the slug already exists.
   * @returns The newly created docID.
   */
  public define({ name, slug, description, interests, retired = false }: ICareerGoalDefine) {
    // Get Interests, throw error if any of them are not found.
    const interestIDs = Interests.getIDs(interests);
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    const docID = this.collection.insert({ name, slugID, description, interestIDs });
    // Connect the Slug to this Interest
    Slugs.updateEntityID(slugID, docID);
    return docID;
  }

  /**
   * Returns a list of Career Goal names corresponding to the passed list of CareerGoal docIDs.
   * @param instanceIDs A list of Career Goal docIDs.
   * @returns { Array } An array of name strings.
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  public findNames(instanceIDs: string[]) {
    return instanceIDs.map((instanceID) => this.findDoc(instanceID).name);
  }

  /**
   * Returns the slug for the given CareerGoalID.
   * @param goalID The CareerGoal ID.
   * @throws { Meteor.Error} If goalID cannot be found.
   */
  public getSlug(goalID: string): string {
    this.assertDefined(goalID);
    const courseDoc = this.findDoc(goalID);
    return Slugs.findDoc(courseDoc.slugID).name;
  }

  /**
   * Update a Career Goal.
   * @param docID The docID to be updated.
   * @param name The new name (optional).
   * @param description The new description (optional).
   * @param interests A new list of interest slugs or IDs. (optional).
   * @throws { Meteor.Error } If docID is not defined, or if any interest is not a defined slug or ID.
   */
  public update(docID: string, { name, description, interests, retired }: ICareerGoalUpdate): void {
    this.assertDefined(docID);
    const updateData: {
      name?: string;
      description?: string;
      interestIDs?: string[];
      retired?: boolean;
    } = {};
    if (name) {
      updateData.name = name;
    }
    if (description) {
      updateData.description = description;
    }
    if (interests) {
      const interestIDs = Interests.getIDs(interests);
      updateData.interestIDs = interestIDs;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the Career Goal.
   * @param instance The docID or slug of the entity to be removed.
   * @throws { Meteor.Error } If docID is not a CareerGoal, or if any User lists this as a Career Goal.
   */
  public removeIt(instance: string) {
    const careerGoalID = this.getID(instance);
    // Check that this is not referenced by any User.
    const isReferenced = Users.someProfiles((profile) => _.includes(profile.careerGoalIDs, careerGoalID));
    if (isReferenced) {
      throw new Meteor.Error(`Career Goal ${instance} is referenced.`);
    }
    // OK, clear to delete.
    return super.removeIt(careerGoalID);
  }

  /**
   * Returns true if CareerGoal has the specified interest.
   * @param careerGoal The user (docID or slug)
   * @param interest The Interest (docID or slug).
   * @returns {boolean} True if the career goal has the associated Interest.
   * @throws { Meteor.Error } If careerGoal is not a career goal or interest is not a Interest.
   */
  public hasInterest(careerGoal: string, interest: string) {
    const interestID = Interests.getID(interest);
    const doc = this.findDoc(careerGoal);
    return _.includes(doc.interestIDs, interestID);
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID and interestIDs.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity() {
    const problems = [];
    this.find().forEach((doc) => {
      if (!Slugs.isDefined(doc.slugID)) {
        problems.push(`Bad slugID: ${doc.slugID}`);
      }
      _.forEach(doc.interestIDs, (interestID) => {
        if (!Interests.isDefined(interestID)) {
          problems.push(`Bad interestID: ${interestID}`);
        }
      });
    });
    return problems;
  }

  /**
   * Returns an object representing the CareerGoal docID in a format acceptable to define().
   * @param docID The docID of a CareerGoal.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): ICareerGoalDefine {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const slug = Slugs.getNameFromID(doc.slugID);
    const description = doc.description;
    const interests = _.map(doc.interestIDs, (interestID) => Interests.findSlugByID(interestID));
    const retired = doc.retired;
    return { name, slug, interests, description, retired };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/career
 */
export const CareerGoals = new CareerGoalCollection();
