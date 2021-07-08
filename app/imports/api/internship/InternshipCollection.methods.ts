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

// local function doesInternshipExist that checks to see if the internship is already in the database

// local function getRelatedInterests which takes in the title and description and returns an array of related interests

// local function getRelatedCareers which takes in the title and description and return an array of related careers

// local function testURLs which will go through all of the URLS in the internship collection and make sure that they work
