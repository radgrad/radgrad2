import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import _ from 'lodash';
import { ROLE } from '../../role/Role';
import { AdvisorProfiles } from '../AdvisorProfileCollection';
import { FacultyProfiles } from '../FacultyProfileCollection';
import { StudentProfiles } from '../StudentProfileCollection';
import { ProfileOpportunities } from './ProfileOpportunityCollection';

export const getUserIDsWithProfileOpportunityMethod = new ValidatedMethod({
  name: 'ProfileOpportunities.users',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ opportunityID, role }) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get profile entries.');
    }
    if (Meteor.isServer) {
      // console.log(opportunityID, ProfileOpportunities.findNonRetired({ opportunityID }));
      let userIDs;
      const favUserIDs = ProfileOpportunities.findNonRetired({ opportunityID }).map((profile) => profile.userID);
      switch (role.toUpperCase()) {
        case ROLE.ADVISOR:
          userIDs = AdvisorProfiles.findNonRetired().map((profile) => profile.userID);
          break;
        case ROLE.ALUMNI:
          userIDs = StudentProfiles.findNonRetired({ isAlumni: true }).map((profile) => profile.userID);
          break;
        case ROLE.FACULTY:
          userIDs = FacultyProfiles.findNonRetired().map((profile) => profile.userID);
          break;
        default:
          userIDs = StudentProfiles.findNonRetired({ isAlumni: false }).map((profile) => profile.userID);
          break;
      }
      // console.log('method', userIDs, favUserIDs);
      return _.intersection(userIDs, favUserIDs);
    }
    return [];
  },
});
