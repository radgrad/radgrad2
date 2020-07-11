import { Meteor } from 'meteor/meteor';
import { DDP } from 'meteor/ddp-client';
import _ from 'lodash';
import { ValidatedMethod } from 'meteor/maestroqadev:validated-method';
import { RadGrad } from '../radgrad/RadGrad';
import { Users } from '../user/UserCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/**
 * Returns the definition array associated with collectionName in the loadJSON structure,
 * or an empty array if none was found.
 * @param loadJSON The load file contents.
 * @param collection The collection of interest.
 * @memberOf api/test
 */
export function getDefinitions(loadJSON, collection) {
  const definitionObj = _.find(loadJSON.collections, (obj) => obj.name === collection);
  return definitionObj ? definitionObj.contents : [];
}

/**
 * Given a collection and the loadJSON structure, looks up the definitions and invokes define() on them.
 * @param collection The collection to be loadd.
 * @param loadJSON The structure containing all of the definitions.
 * @param consolep output console.log message if truey.
 * @memberOf api/test
 */
export function loadCollection(collection, loadJSON, consolep) {
  const definitions = getDefinitions(loadJSON, collection.collectionName);
  if (consolep) {
    console.log(`Defining ${definitions.length} ${collection.collectionName} documents.`);
  }
  _.each(definitions, (definition) => collection.define(definition));
  if (consolep) {
    console.log(`Have ${collection.find().count()} documents.`);
  }
}

/**
 * Loads data from a modular test fixture file.
 * @param fixtureName The name of the test fixture data file. (located in private/database/modular).
 * @memberOf api/test
 */
export function defineTestFixture(fixtureName) {
  if (Meteor.isServer) {
    const loadFileName = `database/modular/${fixtureName}`;
    const loadJSON = JSON.parse(Assets.getText(loadFileName));
    console.log(`    Loaded ${loadFileName}: ${loadJSON.fixtureDescription}`);
    _.each(RadGrad.collectionLoadSequence, (collection) => loadCollection(collection, loadJSON, false));
  }
}

/**
 * Loads all the data from an array of fixture file names.
 * @param fixtureNames an array of the name of the test fixture data file. (located in private/database/modular).
 * @memberOf api/test
 */
export function defineTestFixtures(fixtureNames) {
  _.each(fixtureNames, (fixtureName) => defineTestFixture(`${fixtureName}.fixture.json`));
}

// /**
//  * A validated method that loads the passed fixture file.
//  */
// export const defineTestFixtureMethod = new ValidatedMethod({
//   name: 'test.defineTestFixtureMethod',
//   validate: null,
//   run(fixtureName) {
//     defineTestFixture(fixtureName);
//     return true;
//   },
// });

/**
 * A validated method that loads the passed list of fixture files in the order passed.
 * @memberOf api/test
 */
export const defineTestFixturesMethod = new ValidatedMethod({
  name: 'test.defineTestFixturesMethod',
  validate: null,
  run(fixtureNames) {
    removeAllEntities();
    defineTestFixtures(fixtureNames);
    return true;
  },
});

/**
 * Returns a Promise that resolves when all RadGrad collections subscriptions are ready.
 * @see {@link https://guide.meteor.com/testing.html#full-app-integration-test}
 * @memberOf api/test
 */
export function withRadGradSubscriptions(userID?: string) {
  return new Promise((resolve) => {
    _.each(RadGrad.collections, (collection) => collection.subscribe(userID));
    Users.subscribe();
    const poll = Meteor.setInterval(() => {
      if (DDP._allSubscriptionsReady()) {
        Meteor.clearInterval(poll);
        resolve();
      }
    }, 200);
  });
}

/**
 * Returns a Promise that resolves if one can successfully login with the passed credentials.
 * Credentials default to the standard admin username and password.
 * @memberOf api/test
 */
export function withLoggedInUser({ username = 'radgrad@hawaii.edu', password = 'foo' } = {}) {
  return new Promise((resolve, reject) => {
    Meteor.loginWithPassword(username, password, (error) => {
      if (error) {
        console.log('Error: withLoggedInUser', error);
        reject();
      } else {
        resolve();
      }
    });
  });
}
