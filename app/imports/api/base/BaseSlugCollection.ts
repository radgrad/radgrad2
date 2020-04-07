import { check } from 'meteor/check';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import BaseCollection from './BaseCollection';
import { Slugs } from '../slug/SlugCollection';

/**
 * BaseSlugCollection is an abstract superclass for use by entities that have a slug.
 * It provides an API where the user can provide either a slug or docID (or document-specifying object).
 * Note it does not define a constructor; subclasses should invoke super(type, schema) to get the
 * BaseCollection constructor.
 * @memberOf api/base
 * @extends api/base.BaseCollection
 */
class BaseSlugCollection extends BaseCollection {

  /**
   * Returns the docID associated with instance, or throws an error if it cannot be found.
   * If instance is an object with an _id field, then that value is checked to see if it's in the collection.
   * If instance is the value for the username field in this collection, then return that document's ID.
   * If instance is a docID, then it is returned unchanged. If instance is a slug, its corresponding docID is returned.
   * @param { String } instance Either a valid docID or a valid slug string.
   * @returns { String } The docID associated with instance.
   * @throws { Meteor.Error } If instance is not a docID or a slug.
   */
  public getID(instance) {
    // console.log(`BaseSlugCollection.getID(${instance})`);
    let id;
    // If we've been passed a document, check to see if it has an _id field and make instance the value of _id.
    if (_.isObject(instance) && _.has(instance, '_id')) {
      instance = instance['_id']; // eslint-disable-line no-param-reassign, dot-notation
    }
    // If instance is the value of the username field for some document in the collection, then return its ID.
    const usernameBasedDoc = this.collection.findOne({ username: instance });
    if (usernameBasedDoc) {
      return usernameBasedDoc._id;
    }
    // Otherwise see if we can find instance as a docID or as a slug.
    try {
      // console.log(instance, this.collection.findOne({ _id: instance }));
      id = (this.collection.findOne({ _id: instance })) ? instance : this.findIdBySlug(instance);
    } catch (err) {
      throw new Meteor.Error(`Error in ${this.collectionName} getID(): Failed to convert ${instance} to an ID. ${err}`);
    }
    return id;
  }

  /**
   * Returns the docIDs associated with instances, or throws an error if any cannot be found.
   * If an instance is a docID, then it is returned unchanged. If a slug, its corresponding docID is returned.
   * If nothing is passed, then an empty array is returned.
   * @param { String[] } instances An array of valid docIDs, slugs, or a combination.
   * @returns { String[] } The docIDs associated with instances.
   * @throws { Meteor.Error } If any instance is not a docID or a slug.
   */
  public getIDs(instances) {
    let ids;
    try {
      ids = (instances) ? instances.map((instance) => this.getID(instance)) : [];
    } catch (err) {
      throw new Meteor.Error(`Error in getIDs(): Failed to convert one of ${instances} an ${this.type} to an ID. ${err}`);
    }
    return ids;
  }

  /**
   * Removes the passed instance from its collection.
   * Also removes the associated Slug.
   * Note that prior to calling this method, the subclass should do additional checks to see if any dependent
   * objects have been deleted.
   * @param { String } instance A docID or slug representing the instance.
   * @throws { Meteor.Error} If the instance (and its associated slug) cannot be found.
   */
  public removeIt(instance) {
    const docID = this.getID(instance);
    const doc = super.findDoc(docID);
    check(doc, Object);
    // @ts-ignore
    if (Slugs.isDefined(doc.slugID)) {
      // @ts-ignore
      const slugDoc = Slugs.findDoc(doc.slugID);
      check(slugDoc, Object);
      Slugs.removeIt(slugDoc);
    }
    return super.removeIt(doc);
  }

  /**
   * Return true if instance is a docID or a slug for this entity.
   * @param { String } instance A docID or a slug.
   * @returns {boolean} True if instance is a docID or slug for this entity.
   */
  public isDefined(instance) {
    // console.log('isDefined(%o)', instance);
    return (super.isDefined(instance) || this.hasSlug(instance));
  }

  /**
   * Returns true if the passed slug is associated with an entity of this type.
   * @param { String } slug Either the name of a slug or a slugID.
   * @returns {boolean} True if the slug is in this collection.
   */
  public hasSlug(slug) {
    return (!!(this.collection.findOne({ slug })) || Slugs.isSlugForEntity(slug, this.type));
  }

  /**
   * Return the docID of the instance associated with this slug.
   * @param { String } slug The slug (string or docID).
   * @returns { String } The docID.
   * @throws { Meteor.Error } If the slug cannot be found, or is not associated with an instance in this collection.
   */
  public findIdBySlug(slug) {
    // console.log(`findIdBySlug(${slug})`);
    return Slugs.getEntityID(slug, this.type);
  }

  /**
   * Returns a list of docIDs associated with the instances associated with the list of slugs.
   * @param { Array } slugs A list or collection of slugs.
   * @return { Array } A list of docIDs.
   * @throws { Meteor.Error } If the slug cannot be found, or is not associated with an instance in this collection.
   */
  public findIdsBySlugs(slugs) {
    return slugs.map((slug) => this.findIdBySlug(slug));
  }

  /**
   * Returns the instance associated with the passed slug.
   * @param { String } slug The slug (string or docID).
   * @returns { Object } The document representing the instance.
   * @throws { Meteor.Error } If the slug cannot be found, or is not associated with an instance in this collection.
   */
  public findDocBySlug(slug: string) {
    return this.findDoc(this.findIdBySlug(slug));
  }

  /**
   * Returns the slug name associated with this docID.
   * @param docID The docID
   * @returns { String } The slug name
   * @throws { Meteor.Error } If docID is not associated with this entity.
   */
  public findSlugByID(docID: string) {
    this.assertDefined(docID);
    return Slugs.findDoc(this.findDoc(docID).slugID).name;
  }
}

/**
 * Provide this class for use by instance collections such as Interest.
 */
export default BaseSlugCollection;
