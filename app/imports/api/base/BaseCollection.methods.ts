import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/maestroqadev:validated-method';
import _ from 'lodash';
import { RadGrad } from '../radgrad/RadGrad';
import { ROLE } from '../role/Role';
import { Users } from '../user/UserCollection';
import { loadCollectionNewDataOnly } from '../utilities/load-fixtures';

/**
 * Allows admins to create and return a JSON object to the client representing a snapshot of the RadGrad database.
 * @memberOf api/base
 */
export const dumpDatabaseMethod = new ValidatedMethod({
  name: 'base.dumpDatabase',
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to dump the database..');
    } else {
      const profile = Users.getProfile(this.userId);
      if (profile.role !== ROLE.ADMIN) {
        throw new Meteor.Error('unauthorized', 'You must be an admin to dump the database.');
      }
    }
    // Don't do the dump except on server side (disable client-side simulation).
    // Return an object with fields timestamp and collections.
    if (Meteor.isServer) {
      const collections = _.sortBy(RadGrad.collectionLoadSequence.map((collection) => collection.dumpAll()),
        (entry) => entry.name);
      const timestamp = new Date();
      return { timestamp, collections };
    }
    return null;
  },
});

/**
 * Meteor method used to define new instances of the given collection name.
 * @param collectionName the name of the collection.
 * @param definitionDate the object used in the collection.define method.
 * @memberOf api/base
 */
export const defineMethod = new ValidatedMethod({
  name: 'BaseCollection.define',
  mixins: [CallPromiseMixin],
  applyOptions: { enhanced: true },
  validate: null,
  run({ collectionName, definitionData }) {
    if (Meteor.isServer) {
      // console.log(collectionName, this.userId, definitionData);
      const collection = RadGrad.getCollection(collectionName);
      collection.assertValidRoleForMethod(this.userId);
      return collection.define(definitionData);
    }
    return '';
  },
});

export const updateMethod = new ValidatedMethod({
  name: 'BaseCollection.update',
  mixins: [CallPromiseMixin],
  applyOptions: { enhanced: true },
  validate: null,
  run({ collectionName, updateData }) {
    if (Meteor.isServer) {
      // console.log('updateMethod(%o, %o)', collectionName, updateData);
      const collection = RadGrad.getCollection(collectionName);
      collection.assertValidRoleForMethod(this.userId);
      collection.update(updateData.id, updateData);
    }
  },
});

export const removeItMethod = new ValidatedMethod({
  name: 'BaseCollection.removeIt',
  mixins: [CallPromiseMixin],
  applyOptions: { enhanced: true },
  validate: null,
  run({ collectionName, instance }) {
    const collection = RadGrad.getCollection(collectionName);
    collection.assertValidRoleForMethod(this.userId);
    collection.removeIt(instance);
    // return true;
  },
});

export const loadFixtureMethod = new ValidatedMethod({
  name: 'base.loadFixture',
  applyOptions: { enhanced: true },
  validate: null,
  run(fixtureData) {
    // console.log('loadFixtureMethod', fixtureData);
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to load a fixture.', '');
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin to load a fixture.', '');
    }
    if (Meteor.isServer) {
      let ret = '';
      // console.log(RadGrad.collectionLoadSequence);
      _.forEach(RadGrad.collectionLoadSequence, (collection) => {
        const result = loadCollectionNewDataOnly(collection, fixtureData, true);
        // console.log(collection.getCollectionName(), result);
        if (result) {
          ret = `${ret} ${result},`;
        }
      });
      // console.log(`loadFixtureMethod ${ret}`);
      const trimmed = ret.trim();
      if (trimmed.length === 0) {
        ret = 'Defined no new instances.';
      } else {
        ret = ret.substring(0, ret.length - 1); // trim off trailing ,
      }
      return ret;
    }
    return '';
  },
});
