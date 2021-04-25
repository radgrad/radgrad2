import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import moment from 'moment';
import { defineAcademicTerms } from '../../api/academic-term/AcademicTermUtilities';
import { PublicStats } from '../../api/public-stats/PublicStatsCollection';
import { RadGrad } from '../../api/radgrad/RadGrad';
import { RadGradProperties } from '../../api/radgrad/RadGradProperties';
import { loadCollection } from '../../api/test/test-utilities';
import { checkIntegrity } from '../../api/integrity/IntegrityChecker';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

/** global Assets */
/* eslint-disable no-console */

/**
 * Returns an Array of numbers, one per loadable collection, indicating the number of documents in that collection.
 * @returns { Array } An array of collection document counts.
 * @memberOf startup/server
 */
const documentCounts = () => RadGrad.collectionLoadSequence.map((collection) => collection.count());

/**
 * Returns the total number of documents in the loadable collections.
 * @returns { Number } The total number of RadGrad documents in the loadable collections.
 * @memberOf startup/server
 */
const totalDocuments = () => documentCounts().reduce((sum, count) => sum + count, 0);

/**
 * The load/fixture file date format.
 * Used when dumping and restoring the RadGrad database.
 * @type {string}
 * @memberOf startup/server
 */
const loadFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

/**
 * Returns a string indicating how long ago the load file was created. Parses the file name string.
 * @param loadFileName The file name.
 * @returns { String } A string indicating how long ago the file was created.
 * @memberOf startup/server
 */
const getRestoreFileAge = (loadFileName) => {
  const terms = _.words(loadFileName, /[^/. ]+/g);
  const dateString = terms[terms.length - 2];
  return moment(dateString, loadFileDateFormat).fromNow();
};

/**
 * If the database is empty, this function looks up the name of the load file in the settings file,
 * and if it is specified, then it reads it in and calls define() on its contents in order to load the database.
 * Console messages are generated when the contents of the load file does not include collections that
 * this function assumes are present. Conversely, if the load file contains collections not processed with
 * this file, a string is also printed out.
 * @memberOf startup/server
 */
export const loadDatabase = () => {
  const loadFileName = Meteor.settings.databaseRestoreFileName;
  if (loadFileName && (totalDocuments() === 0 || totalDocuments() === 1)) {
    const loadFileAge = getRestoreFileAge(loadFileName);
    console.log(`Loading database from file ${loadFileName}, dumped ${loadFileAge}.`);
    const loadJSON = JSON.parse(Assets.getText(loadFileName));
    // The list of collections, ordered so that they can be sequentially restored.
    const collectionList = RadGrad.collectionLoadSequence;

    const loadNames = loadJSON.collections.map((obj) => obj.name);
    const collectionNames = collectionList.map((collection) => collection.getCollectionName());
    const extraRestoreNames = _.difference(loadNames, collectionNames);
    const extraCollectionNames = _.difference(collectionNames, loadNames);

    if (extraRestoreNames.length) {
      console.log(`Error: The following collections are in ${loadFileName}, but not in RadGrad.collectionLoadSequence: ${extraRestoreNames}`);
    }
    if (extraCollectionNames.length) {
      console.log(`Error: The following collections are in RadGrad.collectionLoadSequence, but missing from ${loadFileName}: ${extraCollectionNames}`);
    }

    if (!extraRestoreNames.length && !extraCollectionNames.length) {
      collectionList.forEach((collection) => loadCollection(collection, loadJSON, true));
    }
    const loadTimeString = loadFileName.substring(loadFileName.lastIndexOf('/') + 1, loadFileName.indexOf('.'));
    // console.log(loadTimeString);
    // CAM is this the right time to set?
    PublicStats.setCareerGoalUpdateTime(loadTimeString);
    PublicStats.setCoursesUpdateTime(loadTimeString);
    PublicStats.setInterestsUpdateTime(loadTimeString);
    PublicStats.setOpportunitiesUpdateTime(loadTimeString);
    // CAM make sure we have AcademicTerms.
    defineAcademicTerms();
    console.log('Finished loading database.');
  }
};

/**
 * Check the integrity of the newly loaded collections; print out problems if any occur.
 * @memberOf startup/server
 */
export const startupCheckIntegrity = () => {
  // console.log('Checking DB integrity.');
  const integrity = checkIntegrity();
  if (integrity.count > 0) {
    console.log(checkIntegrity().message);
  }
};

export const defineAdminUser = () => {
  const adminProfile = RadGradProperties.getAdminProfile();
  if (!adminProfile) {
    console.error('\n\nNO ADMIN PROFILE SPECIFIED IN SETTINGS FILE! SHUTDOWN AND FIX!!\n\n');
    return;
  }
  const user = Meteor.users.findOne({ username: adminProfile.username });
  if (!user) {
    AdminProfiles.define(adminProfile);
  }
};

export const defineTestAdminUser = () => {
  if (Meteor.isTest || Meteor.isAppTest) {
    const adminProfile = {
      username: 'radgrad@hawaii.edu',
      firstName: 'RadGrad',
      lastName: 'Admin',
    };
    AdminProfiles.define(adminProfile);
  }
};
