import { Meteor } from 'meteor/meteor';
import { fetch } from 'meteor/fetch';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { ProfileInterests } from '../user/profile-entries/ProfileInterestCollection';
import { Internships } from './InternshipCollection';
import { ROLE } from '../role/Role';

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
        const profileInterests = ProfileInterests.findNonRetired({ userID: studentID });
        const interestIDs = profileInterests.map((pi) => pi.interestID);
        return Internships.findBestMatch(interestIDs);
      }
      return [];
    }
  },
});

export const getInternshipFromKeyMethod = new ValidatedMethod({
  name: 'internship.getFromKey',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ internshipKey }) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get an internship.');
    }
    if (Meteor.isServer) {
      // console.log(internshipKey);
      const internship = Internships.findDoc({ guid: internshipKey });
      // console.log(internship);
      return internship;
    }
    return undefined;
  },
});

async function getUrlJson(url) {
  const response = await fetch(url);
  return response.json();
}

export const getInternAlohaInternshipsMethod = new ValidatedMethod({
  name: 'internship.getInternAloha',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ url }) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get internships.');
    } else { // TODO add check for admin.
      // Don't do the work except on server side (disable client-side simulation).
      if (Meteor.isServer) {
        return getUrlJson(url);
      }
      return undefined;
    }
  },
});

export const incrementMissedUploadsMethod = new ValidatedMethod({
  name: 'internship.incrementMissedUploads',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get internships.');
    } else {
      // Don't do the work except on server side (disable client-side simulation).
      if (Meteor.isServer) {
        const internships = Internships.findNonRetired();
        internships.forEach(internship => {
          const docID = internship._id;
          const missedUploads = internship.missedUploads + 1;
          Internships.update(docID, { missedUploads });
        });
      }
      return true;
    }
  },
});

export const getInternshipCountPerInterestMethod = new ValidatedMethod({
  name: 'internship.getInternshipCountPerInterest',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get internships.');
    } else {
      if (Meteor.isServer) {
        const retVal = {};
        // const internships = Internships.getInternshipsWithInterest(interests[2]);
        const interestToInternship = Internships.getInterestToInternships();
        // console.log(interestToInternship);
        for (const [key, value] of Object.entries(interestToInternship)) {
          // @ts-ignore
          retVal[key] = value.length;
        }
        // retVal[interests[2].name] = internships.length;
        // console.log(retVal);
        return retVal;
      }
      return {};
    }
  },
});

export const removeAllInternshipsMethod = new ValidatedMethod({
  name: 'internship.removeAllInternships',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to remove all internships.', '');
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin to remove all internships.', '');
    }
    if (Meteor.isServer) {
      Internships.removeAll();
    }
  },
});
