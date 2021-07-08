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


/**
 * Function: internshipJSONtoInternshipItem
 * Purpose: This function will convert the JSON file into internship items/array.
 */

/**
 * Function: removeDuplicates
 * Purpose: This function should iterate through all the items in the JSON file and remove duplicates. This
 * function could probably use underscores _.uniq .
 */

/**
 * Function: generateInternshipID
 * Purpose: This function will give each internship a id in the format internship-<internship title>-<YYYY-MM-DD-HH-MM-SS-MSS>.
 */

/**
 * Function: assignInterestCareerGoals
 * Purpose: This function will iterate through each new internship and assign it with appropriate Interests
 * and Career Goals. It will have to cross reference with the Interests and Career Goals collections. Could
 * probably cross reference using the skill category in the JSON file from the scraper. Get one internship
 * from the JSON file then cross reference it with all the Interests and Career Goals.
 */

/**
 * Function: retireAllOldInternships
 * Purpose: This function will mark the old internships with the tag retired so they dont show up anymore.
 * Probably will be similar to the retireOldStudentMethod except it will use missedUploads to tell us if it
 * needs to be retired. (e.g. if less than four not retired, if greater than 4 retired)
 * Also if the Link returns back as broken or not working then it should be retired.
 */

/**
 * Function: checkInternshipLinks
 * Purpose: This function will check the internships links. If it is broken or the link does not work then
 * this function will mark the internship's missUploads with 8 signalling it needs to be retired.
 */