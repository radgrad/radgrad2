import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { SlugDefine } from '../../typings/radgrad';

/**
 * Slugifies the give text.
 * @param text
 * @return {string}
 * @memberOf api/slug
 */
const slugify = (text: string): string =>
  (text
    ? text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
    : 'undefined');
// TODO why are we export default the function?
export default slugify;

/**
 * Slugs are unique strings that can be used to identify entities and can be used in URLs.
 * @extends api/base.BaseCollection
 * @memberOf api/slug
 */
class SlugCollection extends BaseCollection {
  /**
   * Creates the Slug collection.
   */
  constructor() {
    super(
      'Slug',
      new SimpleSchema({
        entityID: { type: SimpleSchema.RegEx.Id, optional: true },
        entityName: { type: String },
        name: { type: String },
      }),
    );
    if (Meteor.isServer) {
      this.collection.rawCollection().createIndex({ name: 1, entityName: 1 });
    }
  }

  /**
   * Creates a new Slug instance and adds it to the collection.
   * @example
   * Slugs.define({ name: 'software-engineering', entityName: 'Interest' });
   * @param { String } name The name of the slug. Must be globally unique across all entities.
   * @param { String } entityName The entity it is associated with.
   * @returns { String } The docID of the created Slug.
   * @throws { Meteor.Error } If the slug already exists.
   */
  public define({ name, entityName }: SlugDefine) {
    check(name, String); // TODO: Do we need this? I don't think so, Typescript ensures the type.
    check(entityName, String);
    if (super.isDefined(name)) {
      throw new Meteor.Error(`Attempt to redefine slug: ${name}`);
    }
    if (!this.isValidSlugName(name)) {
      throw new Meteor.Error(`Slug is not a-zA-Z0-9 or dash, period, underscore, or @: ${name}`);
    }
    const docID = this.collection.insert({ name, entityName });
    return docID;
  }

  /**
   * Returns true if slugName is syntactically valid (i.e. consists of a-zA-Z0-9 or dash or underscore.)
   * @param slugName The slug name.
   * @returns {boolean} True if it's OK.
   */
  public isValidSlugName(slugName: string) {
    const slugRegEx = new RegExp('^[a-zA-Z0-9@.]+(?:[_-][a-zA-Z0-9@.]+)*$');
    return typeof slugName === 'string' && slugName.length > 0 && slugRegEx.test(slugName);
  }

  /**
   * Updates a Slug with the docID of the associated entity.
   * @param { String } slugID The docID of this Slug.
   * @param { String } entityID The docID of the entity to be associated with this Slug.
   */
  public updateEntityID(slugID: string, entityID: string) {
    this.collection.update(slugID, { $set: { entityID } });
  }

  /**
   * Returns the docID of the entity associated with this Slug.
   * @param { String } slugName The slug name or docID.
   * @param { String } entityName The entity type expected.
   * @returns { String } The docID of the entity.
   * @throws { Meteor.Error } If the slug or entity cannot be found or is the wrong type.
   */
  public getEntityID(slugName: string, entityName: string) {
    if (!this.isDefined(slugName)) {
      throw new Meteor.Error(`Undefined slug ${slugName}.`);
    }
    const doc = this.findDoc(slugName);
    if (doc.entityName !== entityName) {
      throw new Meteor.Error(`Slug ${slugName} is not associated with the entity ${entityName}.`);
    }
    return doc.entityID;
  }

  /**
   * Returns true if slugName is a slug and is defined for the entity.
   * @param slugName The slug name.
   * @param entityName The entity for which this might be a defined slug.
   * @returns True if slugName is defined for entityName.
   */
  public isSlugForEntity(slugName: string, entityName: string) {
    if (!this.isDefined(slugName)) {
      return false;
    }
    const doc = this.findDoc(slugName);
    return doc.entityName === entityName;
  }

  /**
   * Returns true if the passed slugID is defined in this collection.
   * In the case of SlugCollection, hasSlug is a synonym for isDefined, and you should use isDefined instead.
   * @param { String } slugID A docID.
   * @returns {boolean} True if the slugID is in this collection.
   */
  public hasSlug(slugID: string): boolean {
    return this.isDefined(slugID);
  }

  /**
   * Returns the slug name associated with this ID.
   * @param slugID The slug ID.
   * @returns The slug name.
   * @throws { Meteor.Error } If the passed slugID is not valid.
   */
  public getNameFromID(slugID: string): string {
    this.assertDefined(slugID);
    return this.findDoc(slugID).name;
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } docOrID A document or docID in this collection.
   */
  public removeIt(docOrID: string | { [key: string]: unknown }) {
    // console.log('Slugs.removeIt', docOrID);
    return super.removeIt(docOrID);
  }

  /**
   * Throws an Error if the passed slugName is not a slugName.
   * @param slugName The SlugName
   * @throws { Meteor.Error } If the passed slugName is not a slug name.
   */
  public assertSlug(slugName: string) {
    if (!this.collection.findOne({ name: slugName })) {
      throw new Meteor.Error(`Undefined slug ${slugName}.`);
    }
  }

  /**
   * Returns an empty array (no integrity checking done on Slugs.)
   * @returns {Array} An empty array.
   */
  public checkIntegrity() {
    return [];
  }

  /**
   * Returns an object representing the passed slug docID in a format acceptable to define().
   * @param docID The docID of a Slug.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID): SlugDefine {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const entityName = doc.entityName;
    return { name, entityName };
  }
}

/**
 * Provides the singleton instance of a SlugCollection to all other entities.
 * @type {api/slug.SlugCollection}
 * @memberOf api/slug
 */
export const Slugs = new SlugCollection();
