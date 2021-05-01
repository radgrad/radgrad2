import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import _ from 'lodash';
import { ROLE } from '../../role/Role';
import { AdvisorProfiles } from '../AdvisorProfileCollection';
import { FacultyProfiles } from '../FacultyProfileCollection';
import { StudentProfiles } from '../StudentProfileCollection';
import { ProfileInterests } from './ProfileInterestCollection';
import { EXPLORER_TYPE } from '../../../ui/utilities/ExplorerUtils';
import { ProfileCareerGoals } from './ProfileCareerGoalCollection';

export const getUserIDsWithProfileInterestMethod = new ValidatedMethod({
  name: 'ProfileInterests.users',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ itemID, role, explorerType }) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get profile entries.');
    }
    if (Meteor.isServer) {
      let userIDs;
      let favUserIDs;
      switch (explorerType) {
        case EXPLORER_TYPE.INTERESTS:
          // eslint-disable-next-line no-case-declarations
          const interestID = itemID;
          favUserIDs = ProfileInterests.findNonRetired({ interestID }).map((profile) => profile.userID);
          break;
        case EXPLORER_TYPE.CAREERGOALS:
          // eslint-disable-next-line no-case-declarations
          const careerGoalID = itemID;
          favUserIDs = ProfileCareerGoals.findNonRetired({ careerGoalID }).map((profile) => profile.userID);
          break;
      }
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
      return _.intersection(userIDs, favUserIDs);
    }
    return [];
  },
});
