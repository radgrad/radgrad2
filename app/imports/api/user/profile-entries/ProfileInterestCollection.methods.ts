import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import _ from 'lodash';
import { ROLE } from '../../role/Role';
import { AdvisorProfiles } from '../AdvisorProfileCollection';
import { FacultyProfiles } from '../FacultyProfileCollection';
import { StudentProfiles } from '../StudentProfileCollection';
import { ProfileInterests } from './ProfileInterestCollection';

export const getUserIDsWithProfileInterestMethod = new ValidatedMethod({
  name: 'ProfileInterests.users',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ interestID, role }) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get profile entries.');
    }
    if (Meteor.isServer) {
      let userIDs;
      const favUserIDs = _.map(ProfileInterests.find({ interestID }).fetch(), 'userID');
      switch (role.toUpperCase()) {
        case ROLE.ADVISOR:
          userIDs = _.map(AdvisorProfiles.find().fetch(), 'userID');
          break;
        case ROLE.ALUMNI:
          userIDs = _.map(StudentProfiles.find({ isAlumni: true }).fetch(), 'userID');
          break;
        case ROLE.FACULTY:
          userIDs = _.map(FacultyProfiles.find().fetch(), 'userID');
          break;
        default:
          userIDs = _.map(StudentProfiles.find({ isAlumni: false }).fetch(), 'userID');
          break;
      }
      return _.intersection(userIDs, favUserIDs);
    }
    return [];
  },
});
