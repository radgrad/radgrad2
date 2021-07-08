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

// function importInternships
/*
* Prerequisite: Should make a main function within Internaloha to combine all the scraped json files.
* Either reads and filters out a json file imported from Internaloha or scrapes the combined json file from the github link.
* Primary Filter will check through all the URLs for any duplicates.
* Secondary Filter has three parameters to look at: Position, Company, and Location. Any small changes is grounds for removal.
* Tertiary Filter checks if any of the listings is already a duplicate of current RadGrad internships and removes them from the list.
* Passing these three walls will create a new RadGrad internship and its guid from it's time of creation.
 */

// function getTags: compares the InternAloha tags w/RadGrad's tags to determine added tags.

// function relatedCareers: checks for careers based off newly added tags

// function relatedInterests: checks for interests based off newly added tags

// function checkRetired: compares the time of current listings posted to date.now() and determine if listing should be removed.

