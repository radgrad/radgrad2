import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import _ from 'lodash';
import { ROLE } from '../../role/Role';
import { AdvisorProfiles } from '../AdvisorProfileCollection';
import { FacultyProfiles } from '../FacultyProfileCollection';
import { StudentProfiles } from '../StudentProfileCollection';
import { Users } from '../UserCollection';
import { ProfileCourses } from './ProfileCourseCollection';
import { ProfileInterests } from './ProfileInterestCollection';
import { EXPLORER_TYPE } from '../../../ui/utilities/ExplorerUtils';
import { ProfileCareerGoals } from './ProfileCareerGoalCollection';
import { ProfileOpportunities } from './ProfileOpportunityCollection';

/** Returns a function that is passed a userID and returns true if shareField in their profile is true. */
const filterByShareField = (shareField) => (
  userID => {
    const profile = Users.getProfile(userID);
    return _.has(profile, shareField) && profile[shareField];
  }
);

export const getVisibleUsernames = new ValidatedMethod({
  name: 'ProfileExplorer.getVisibleUsernames',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ itemID, explorerType }) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get visible usernames.');
    }
    const usernames = {};
    if (Meteor.isServer) {
      let profileUserIDs = [];
      let visibleUserIDs = [];
      // First, find all the users who have added this type of entity to their profile.
      if (explorerType === EXPLORER_TYPE.INTERESTS) {
        profileUserIDs = ProfileInterests.findNonRetired({ interestID: itemID }).map(profile => profile.userID);
        visibleUserIDs = profileUserIDs.filter(filterByShareField('shareInterests'));
      } else if (explorerType === EXPLORER_TYPE.CAREERGOALS) {
        profileUserIDs = ProfileCareerGoals.findNonRetired({ careerGoalID: itemID }).map(profile => profile.userID);
        visibleUserIDs = profileUserIDs.filter(filterByShareField('shareCareerGoals'));
      } else if (explorerType === EXPLORER_TYPE.COURSES) {
        profileUserIDs = ProfileCourses.findNonRetired({ courseID: itemID }).map(profile => profile.studentID);
        visibleUserIDs = profileUserIDs.filter(filterByShareField('shareCourses'));
      } else if (explorerType === EXPLORER_TYPE.OPPORTUNITIES) {
        profileUserIDs = ProfileOpportunities.findNonRetired({ opportunityID: itemID }).map(profile => profile.studentID);
        visibleUserIDs = profileUserIDs.filter(filterByShareField('shareOpportunities'));
      }
      // Now group by role
      const studentVisibleIDs = _.intersection(visibleUserIDs, StudentProfiles.findNonRetired().map(profile => profile.userID));
      const facultyVisibleIDs = _.intersection(visibleUserIDs, FacultyProfiles.findNonRetired().map(profile => profile.userID));
      const advisorVisibleIDs = _.intersection(visibleUserIDs, AdvisorProfiles.findNonRetired().map(profile => profile.userID));
      // Now return the username.
      usernames[ROLE.STUDENT] = studentVisibleIDs.map(id => Users.getProfile(id).username);
      usernames[ROLE.FACULTY] = facultyVisibleIDs.map(id => Users.getProfile(id).username);
      usernames[ROLE.ADVISOR] = advisorVisibleIDs.map(id => Users.getProfile(id).username);
    }
    return usernames;
  },
});
