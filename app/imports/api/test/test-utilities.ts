import { Meteor } from 'meteor/meteor';
// import { DDP } from 'meteor/ddp-client';
import _ from 'lodash';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { RadGrad } from '../radgrad/RadGrad';
import { Users } from '../user/UserCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/**
 * Sleeps for ms milliseconds.
 *
 * @param ms {number} the number of milliseconds to sleep.
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Returns the definition array associated with collectionName in the loadJSON structure,
 * or an empty array if none was found.
 * @param loadJSON The load file contents.
 * @param collection The collection of interest.
 * @memberOf api/test
 */
export const getDefinitions = (loadJSON, collection) => {
  const definitionObj = _.find(loadJSON.collections, (obj) => obj.name === collection);
  return definitionObj ? definitionObj.contents : [];
};

/**
 * Given a collection and the loadJSON structure, looks up the definitions and invokes define() on them.
 * @param collection The collection to be loadd.
 * @param loadJSON The structure containing all of the definitions.
 * @param consolep output console.log message if truey.
 * @memberOf api/test
 */
export const loadCollection = (collection, loadJSON, consolep) => {
  const definitions = getDefinitions(loadJSON, collection.collectionName);
  if (consolep) {
    console.log(`Defining ${definitions.length} ${collection.collectionName} documents.`);
  }
  definitions.forEach((definition) => collection.define(definition));
  if (consolep) {
    console.log(`Have ${collection.find().count()} documents.`);
  }
};

/**
 * Loads data from a modular test fixture file.
 * @param fixtureName The name of the test fixture data file. (located in private/database/modular).
 * @memberOf api/test
 */
export const defineTestFixture = (fixtureName) => {
  if (Meteor.isServer) {
    const loadFileName = `database/modular/${fixtureName}`;
    const loadJSON = JSON.parse(Assets.getText(loadFileName));
    console.log(`    Loaded ${loadFileName}: ${loadJSON.fixtureDescription}`);
    RadGrad.collectionLoadSequence.forEach((collection) => loadCollection(collection, loadJSON, false));
  }
};

/**
 * Loads all the data from an array of fixture file names.
 * @param fixtureNames an array of the name of the test fixture data file. (located in private/database/modular).
 * @memberOf api/test
 */
export const defineTestFixtures = (fixtureNames) => {
  fixtureNames.forEach((fixtureName) => defineTestFixture(`${fixtureName}.fixture.json`));
};

/**
 * A validated method that loads the passed list of fixture files in the order passed.
 * @memberOf api/test
 */
export const defineTestFixturesMethod = new ValidatedMethod({
  name: 'test.defineTestFixturesMethod',
  mixins: [CallPromiseMixin],
  validate: null,
  run(fixtureNames) {
    if (Meteor.isServer) {
      removeAllEntities();
      defineTestFixtures(fixtureNames);
      return true;
    }
    return true;
  },
});

/**
 * Returns a Promise that resolves when all RadGrad collections subscriptions are ready.
 * @see {@link https://guide.meteor.com/testing.html#full-app-integration-test}
 * @memberOf api/test
 */
export const withRadGradSubscriptions = (userID?: string) => new Promise((resolve) => {
  const handles = [];
  RadGrad.collections.forEach((collection) => handles.push(collection.subscribe(userID)));
  handles.push(Users.subscribe());
  const poll = Meteor.setInterval(() => {
    if (DDP._allSubscriptionsReady()) {
      Meteor.clearInterval(poll);
      resolve();
    }
  }, 200);
});

/**
 * Returns a Promise that resolves if one can successfully login with the passed credentials.
 * Credentials default to the standard admin username and password.
 * @memberOf api/test
 */
export const withLoggedInUser = ({ username = 'radgrad@hawaii.edu', password = 'foo' } = {}) => new Promise((resolve, reject) => {
  Meteor.loginWithPassword(username, password, (error) => {
    if (error) {
      console.log('Error: withLoggedInUser', error);
      reject();
    } else {
      resolve();
    }
  });
});
