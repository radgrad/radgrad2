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

// Function for addressing duplication
// Traverse through each internship
// Checks new internships with existing ones based on the position, company, and description.
// If duplication is detected
//  Add the url to the existing internship
//  Update lastUploaded timestamp and missUploads

// Function for finding related Interests and Career Goals
// Looks through the description (skills property in Internship object) and see if anything matches with currently
// Interests. Similar to InternAloha, we can form related Career Goals based on the Interests matches.




