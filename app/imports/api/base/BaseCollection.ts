import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import { ROLE } from '../role/Role';
import { DumpOne } from '../../typings/radgrad';

/**
 * BaseCollection is an abstract superclass of all RadGrad data model entities.
 * It is the direct superclass for SlugCollection and AcademicTermCollection.
 * Other collection classes are derived from BaseSlugCollection or BaseTypeCollection, which are abstract
 * classes that inherit from this one.
 * @memberOf api/base
 */
class BaseCollection {
  public collection: Mongo.Collection<any>;

  protected collectionName: string;

  protected schema: any;

  protected type: string;

  protected defineSchema: any;

  protected updateSchema: any;

  /**
   * Superclass constructor for all RadGrad entities.
   * Defines internal fields needed by all entities: type, collectionName, collection, and schema.
   * @param {String} type The name of the entity defined by the subclass.
   * @param {SimpleSchema} schema The schema for validating fields on insertion to the DB.
   */
  constructor(type: string, schema: any) {
    this.type = type;
    this.collectionName = `${type}Collection`;
    this.collection = new Mongo.Collection(`${type}Collection`);
    this.schema = schema.extend(new SimpleSchema({
      // Force value to be current date (on server) upon insert
      // and prevent updates thereafter.
      createdAt: {
        type: Date,
        autoValue: function () {
          if (this.isInsert) {
            return new Date();
          }
          if (this.isUpsert) {
            return { $setOnInsert: new Date() };
          }
          this.unset();  // Prevent user from supplying their own value
          return undefined;
        },
      },
      // Force value to be current date (on server) upon update
      // and don't allow it to be set upon insert.
      updatedAt: {
        type: Date,
        autoValue: function () {
          if (this.isUpdate) {
            return new Date();
          }
          return undefined;
        },
        optional: true,
      },
    }));
    this.collection.attachSchema(this.schema);
  }

  /**
   * Define documents for the collection.
   * @param {Object} obj the document.
   * @throws Meteor.Error since shouldn't call this method on the base class.
   */
  public define(obj: unknown): string {
    throw new Meteor.Error(`Default define method invoked by collection ${this.collectionName} ${obj}`);
  }

  /**
   * Returns the number of documents in this collection.
   * @returns { Number } The number of elements in this collection.
   */
  public count(): number {
    return this.collection.find().count();
  }

  /**
   * Returns the number of non-retired documents in this collection.
   * @returns { Number } The number of non-retired elements in this collection.
   */
  public countNonRetired(): number {
    return this.collection.find().fetch().filter((doc) => !doc.retired).length;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection.
   */
  public publish(): void {
    if (Meteor.isServer) {
      Meteor.publish(this.collectionName, () => this.collection.find());
    }
  }

  /**
   * Default subscription method for entities.
   * It subscribes to the entire collection.
   */
  public subscribe(userID = undefined) {
    if (Meteor.isClient) {
      // console.log(`${this.collectionName}.subscribe`, userID);
      return Meteor.subscribe(this.collectionName, userID);
    }
    return null;
  }

  /**
   * A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.
   * @param { String | Object } name Either the docID, or an object selector, or the 'name' field value.
   * @returns { Object } The document associated with name.
   * @throws { Meteor.Error } If the document cannot be found.
   */
  public findDoc(name: string | { [key: string]: unknown } | { name } | { _id: string; } | { username: string; }) {
    if (_.isNull(name) || _.isUndefined(name)) {
      throw new Meteor.Error(`${name} is not a defined ${this.type}`);
    }
    const doc = (
      this.collection.findOne(name) ||
      this.collection.findOne({ name }) ||
      this.collection.findOne({ _id: name }) ||
      this.collection.findOne({ username: name }));
    if (!doc) {
      if (typeof name !== 'string') {
        throw new Meteor.Error(`${JSON.stringify(name)} is not a defined ${this.type}`);
      } else {
        throw new Meteor.Error(`${name} is not a defined ${this.type}`);
      }
    }
    return doc;
  }

  /**
   * Runs find on this collection.
   * @see {@link http://docs.meteor.com/#/full/find|Meteor Docs on Mongo Find}
   * @param { Object } selector A MongoDB selector.
   * @param { Object } options MongoDB options.
   * @returns {Mongo.Cursor}
   */
  public find(selector?: { [key: string]: unknown }, options?: { [key: string]: unknown }) {
    const theSelector = (typeof selector === 'undefined') ? {} : selector;
    return this.collection.find(theSelector, options);
  }

  /**
   * Runs find on this collection and returns the non-retired documents.
   * @see {@link http://docs.meteor.com/#/full/find|Meteor Docs on Mongo Find}
   * @param selector { Object } A MongoDB selector.
   * @param options { Object } MongoDB options.
   * @returns { Array } non-retired documents.
   */
  public findNonRetired(selector?: { [key: string]: unknown }, options?: { [key: string]: unknown }) {
    const theSelector = (typeof selector === 'undefined') ? {} : selector;
    return this.collection.find(theSelector, options).fetch().filter((doc) => !doc.retired);
  }

  /**
   * Runs findOne on this collection.
   * @see {@link http://docs.meteor.com/#/full/findOne|Meteor Docs on Mongo Find}
   * @param { Object } selector A MongoDB selector.
   * @param { Object } options MongoDB options.
   * @returns {Mongo.Cursor}
   */
  public findOne(selector?: { [key: string]: unknown }, options?: { [key: string]: unknown }) {
    const theSelector = (typeof selector === 'undefined') ? {} : selector;
    return this.collection.findOne(theSelector, options);
  }

  /**
   * Returns true if the passed entity is in this collection.
   * @param { String | Object } name The docID, or an object specifying a documennt.
   * @returns {boolean} True if name exists in this collection.
   */
  public isDefined(name: string) {
    if (_.isUndefined(name)) {
      return false;
    }
    return (
      !!this.collection.findOne(name) ||
      !!this.collection.findOne({ name }) ||
      !!this.collection.findOne({ _id: name }));
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  public removeIt(name: string | { [key: string]: unknown }): boolean {
    // console.log('BaseCollection.removeIt', name);
    const doc: { _id } = this.findDoc(name);
    check(doc, Object);
    this.collection.remove(doc._id);
    return true;
  }

  /**
   * Removes all elements of this collection.
   * This is implemented by mapping through all elements because mini-mongo does not implement the remove operation.
   * So this approach can be used on both client and server side.
   * removeAll should only used for testing purposes, so it doesn't need to be efficient.
   * @returns true
   */
  public removeAll() {
    const items = this.collection.find().fetch();
    items.forEach((i) => {
      this.removeIt(i._id);
    });
    return true;
  }

  /**
   * Return the type of this collection.
   * @returns { String } The type, as a string.
   */
  public getType() {
    return this.type;
  }

  /**
   * Returns the schema applied to the collection.
   * @return { SimpleSchema }.
   */
  public getCollectionSchema() {
    return this.schema;
  }

  /**
   * Returns a schema for the define method's parameter.
   * @returns { SimpleSchema } the define method's parameter.
   */
  public getDefineSchema() {
    return this.defineSchema;
  }

  /**
   * Returns a schema for the update method's second parameter.
   * @returns { SimpleSchema }.
   */
  public getUpdateSchema() {
    return this.updateSchema;
  }

  /**
   * Return the publication name.
   * @returns { String } The publication name, as a string.
   */
  public getPublicationName() {
    return this.collectionName;
  }

  /**
   * Returns the collection name.
   * @return {string} The collection name as a string.
   */
  public getCollectionName() {
    return this.collectionName;
  }

  /**
   * Returns the Mongo collection.
   * @return {Mongo.Collection} The collection.
   */
  public getCollection() {
    return this.collection;
  }

  /**
   * Returns a string representing all of the documents in this collection.
   * @returns {String}
   */
  public toString(...rest: any[]): string {
    return this.collection.find().fetch().toString();
  }

  /**
   * Verifies that the passed object is one of this collection's instances.
   * @param { String | List } name Should be a defined ID or doc in this collection.
   * @throws { Meteor.Error } If not defined.
   */
  public assertDefined(name: string) {
    if (!this.isDefined(name)) {
      throw new Meteor.Error(`${name} is not a valid instance of ${this.type}.`);
    }
  }

  /**
   * Verifies that the list of passed instances are all members of this collection.
   * @param names Should be a list of docs and/or docIDs.
   * @throws { Meteor.Error } If instances is not an array, or if any instance is not in this collection.
   */
  public assertAllDefined(names: string[]) {
    if (!_.isArray(names)) {
      throw new Meteor.Error(`${names} is not an array.`);
    }
    names.map((name) => this.assertDefined(name));
  }

  /**
   * Default implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or Advisor.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  public assertValidRoleForMethod(userId: string) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY]);
  }

  /**
   * Define the default integrity checker for all applications.
   * Returns an array with a string indicating that this method is not overridden.
   * @returns { array } An array containing a string indicating the use of the default integrity checker.
   */
  public checkIntegrity() {
    return ['There is no integrity checker defined for this collection.'];
  }

  /**
   * Returns an object with two fields: name and contents.
   * Name is the name of this collection.
   * Contents is an array of objects suitable for passing to the restore() method.
   * @returns {Object} An object representing the contents of this collection.
   */
  public dumpAll() {
    const dumpObject: { name: string; contents: DumpOne[]; } = {
      name: this.collectionName,
      contents: this.find().map((docID): DumpOne => this.dumpOne(docID)),
    };
    // If a collection doesn't want to be dumped, it can just return null from dumpOne.
    dumpObject.contents = _.without(dumpObject.contents, null);
    // sort the contents array by slug (if present)
    if (dumpObject.contents[0] && dumpObject.contents[0].slug) {
      dumpObject.contents = _.sortBy(dumpObject.contents, (obj) => obj.slug);
    }
    return dumpObject;
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne function.
   * Must be overridden by each collection.
   * @param docID A docID from this collection.
   * @returns { Object } An object representing this document.
   */
  public dumpOne(docID): DumpOne {
    throw new Meteor.Error(`Default dumpOne method invoked by collection ${this.collectionName} on ${docID}`);
  }

  /**
   * Defines the entity represented by dumpObject.
   * Defaults to calling the define() method if it exists.
   * @param dumpObject An object representing one document in this collection.
   * @returns { String } The docID of the newly created document.
   */
  public restoreOne(dumpObject): string {
    if (typeof this.define === 'function') {
      return this.define(dumpObject);
    }
    return null;
  }

  /**
   * Defines all the entities in the passed array of objects.
   * @param dumpObjects The array of objects representing the definition of a document in this collection.
   */
  public restoreAll(dumpObjects) {
    dumpObjects.forEach((dumpObject) => this.restoreOne(dumpObject));
  }

  /**
   * Internal helper function to simplify definition of the assertValidRoleForMethod method.
   * @param userId The userID.
   * @param roles An array of roles.
   * @throws { Meteor.Error } If userId is not defined or user is not in the specified roles.
   * @returns True if no error is thrown.
   * @ignore
   */
  protected assertRole(userId: string, roles: string[]): boolean {
    // console.log(userId, roles, Roles.userIsInRole(userId, roles));
    if (!userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in.');
    } else if (!Roles.userIsInRole(userId, roles)) {
      throw new Meteor.Error('unauthorized', `You must be one of the following roles: ${roles}`);
    }
    return true;
  }

  /**
   * Internal helper function to simplify definition of the updateData for updateMethod.
   * @param userId The userID.
   * @param roles An array of roles.
   * @returns true if the user is in the roles, false otherwise.
   * @ignore
   */
  protected hasRole(userId, roles) {
    if (!userId) {
      return false;
    }
    return Roles.userIsInRole(userId, roles);
  }

  static getLastUpdatedFromDoc(doc) {
    const updateDate = doc.updatedAt || doc.createdAt;
    return updateDate ? moment(updateDate).format('LL') : 'Unknown update time';
  }
}

/**
 * The BaseCollection used by all RadGrad entities.
 */
export default BaseCollection;
