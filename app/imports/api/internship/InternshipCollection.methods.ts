import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Internships } from './InternshipCollection';

export const getInternshipsMethod = new ValidatedMethod({
  name: 'internship.get',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ studentID }) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get internships.');
    } else {
      // Don't do the work except on server side (disable client-side simulation).
      if (Meteor.isServer) {
        // TODO: Add logic to return the best matching internships.
        return Internships.findNonRetired();
      }
      return [];
    }
  },
});

// exported function uploadInternships function which downloads the internship data JSON files and combines them into one
/*
  * General flow of the function
  * Get all the listing and combine into one array
  * Iterate over the array
    * Check if the listing already exists in the database (call doesInternshipExist function)
      * If yes, update the lastUploaded timestamp and add the URL to the URLs array if it doesn't already exist
      * If not, create a new Internship
        * call getRelatedInterests and getRelatedCareers to get an array of interests and careers for the internship
  * Iterate over the internships in the database
    * Check if lastUploaded equals the current date
      * If not, Increment missedUploads and check to see if missedUploads exceeds 4 or 8
    * Call the testURLs function to ensure that all of the URLs work
 */

// local function doesInternshipExist that checks to see if the internship is already in the database

// local function getRelatedInterests which takes in the title and description and returns an array of related interests

// local function getRelatedCareers which takes in the title and description and return an array of related careers

// local function testURLs which will go through all of the URLS in the internship collection and make sure that they work
