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

// exported function hypothetical name: uploadInternships
// allows anyone with Faculty, Advisor, Admin roles to upload internship information with a JSON file

// local function: duplicateInternshipCheck()
// a function that checks whether the internship exists in the system or not

// local function: getRelatedInterests
// a function that gets interests related to the internship

// local function: getRelatedCareer()
// a function that gets the career related to the internship and returns it

// function: checkInternURL()
// a function that checks whether the URL of that specific internship exists or is funcitional 

