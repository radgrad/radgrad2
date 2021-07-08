import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Internships } from './InternshipCollection';

/**
 * Method for getting the internships that match the student's interests, career goals, etc.
 * @param {String} studentID the student's userID.
 * @type {module:meteor/mdg.validated-method.ValidatedMethod}
 */
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

/**
 * Method for getting canonical internships from InternAloha.
 * @param {Sting} scraper the name of the scraper.
 */
// export const getCanonicalInternshipsMethod = new ValidatedMethod({});

/*
Need a method that builds an array of the InternAloha internships. Fetch all the canonical.data.json files from InternAloha github.

We then can process the array to convert them to InternshipDefines.
  - for each InternAloha need to add interests and career goals
  - Then produce the InternshipDefine object.
  - Then reduce the duplicates.
  - Then add them to the Internships collection.
 */

/*
Need a method to check for 'old/expired' internships. Marks them appropriately.
 */
