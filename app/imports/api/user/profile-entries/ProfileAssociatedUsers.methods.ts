import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import _ from 'lodash';
import { ROLE } from '../../role/Role';
import { AdvisorProfiles } from '../AdvisorProfileCollection';
import { FacultyProfiles } from '../FacultyProfileCollection';
import { StudentProfiles } from '../StudentProfileCollection';
import { ProfileCourses } from './ProfileCourseCollection';
import { ProfileInterests } from './ProfileInterestCollection';
import { EXPLORER_TYPE } from '../../../ui/utilities/ExplorerUtils';
import { ProfileCareerGoals } from './ProfileCareerGoalCollection';
import { ProfileOpportunities } from './ProfileOpportunityCollection';

export const getVisibleUserIDs = new ValidatedMethod({
  name: 'ProfileExplorer.getVisibleUserIDs',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ itemID, explorerType }) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get profile entries.');
    }
    if (Meteor.isServer) {
      let profileUserIDs = [];
      const userIDs = { facultyUserIDs: [], studentUserIDs: [], advisorUserIDs: [] };
      // First, find all the users who have added this type of entity to their profile.
      if (explorerType === EXPLORER_TYPE.INTERESTS) {
        profileUserIDs = ProfileInterests.findNonRetired({ interestID: itemID }).map(profile => profile.userID);
        profileUserIDs = profileUserIDs.filter(filterByShareField('shareInterests'));
      } else if (explorerType === EXPLORER_TYPE.CAREERGOALS) {
        profileUserIDs = ProfileCareerGoals.findNonRetired({ careerGoalID: itemID }).map(profile => profile.userID);
        profileUserIDs = profileUserIDs.filter(filterByShareField('shareCareerGoals'));
      } else if (explorerType === EXPLORER_TYPE.COURSES) {
        profileUserIDs = ProfileCourses.findNonRetired({ courseID: itemID }).map(profile => profile.studentID);
        profileUserIDs = profileUserIDs.filter(filterByShareField('shareCourses'));
      } else if (explorerType === EXPLORER_TYPE.OPPORTUNITIES) {
        profileUserIDs = ProfileOpportunities.findNonRetired({ opportunityID: itemID }).map(profile => profile.studentID);
        profileUserIDs = profileUserIDs.filter(filterByShareField('shareOpportunities'));
      }
    }
  },
});

export const getUserIDsWithProfileExplorerMethod = new ValidatedMethod({
  name: 'ProfileExplorer.users',
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
