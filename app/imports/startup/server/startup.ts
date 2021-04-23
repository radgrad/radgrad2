// Add a startup callback that distinguishes between test and dev/prod mode and does the right thing.
import { Accounts } from 'meteor/accounts-base';
import { SyncedCron } from 'meteor/littledata:synced-cron';
import { Meteor } from 'meteor/meteor';
import { removeAllEntities } from '../../api/base/BaseUtilities';
import { updateFactoids } from '../../api/factoid/Factoids';
import { PublicStats } from '../../api/public-stats/PublicStatsCollection';
import { defineAdminUser, defineTestAdminUser, loadDatabase } from './initialize-db';

/* eslint-disable no-console */

/**
 * Define MAIL_URL appropriately.
 */
const setupMailURL = () => {
  if (Meteor.isTest || Meteor.isAppTest) {
    process.env.MAIL_URL = 'Test MAIL_URL variable';
  } else {
    // Get MAIL_URL from settings file unless already available as an environment variable.
    process.env.MAIL_URL = process.env.MAIL_URL || Meteor.settings.env.MAIL_URL;
  }
};

/**
 * Set up entities and users appropriately for testing environment.
 */
const testModeInitialization = () => {
  console.log('Test mode. Database initialization disabled, current database cleared, rate limiting disabled.');
  Accounts.removeDefaultRateLimit();
  removeAllEntities();
  defineTestAdminUser();
};

/**
 * Set up system for operation in a non-testing environment.
 */
const normalInitialization = () => {
  console.log('Startup:');
  console.log('  * Defining admin user if necessary.');
  defineAdminUser();
  console.log('  * Loading database if necessary.');
  loadDatabase();
  // console.log('  * Checking integrity.');
  // startupCheckIntegrity();
  console.log('  * Starting up public stats.');
  PublicStats.generateStats();
  console.log('  * Updating factoids.');
  updateFactoids();
  console.log('  * Starting up cron jobs');
  SyncedCron.start();
};

Meteor.startup(() => {
  setupMailURL();
  if (Meteor.isTest || Meteor.isAppTest) {
    testModeInitialization();
  } else {
    normalInitialization();
  }
});