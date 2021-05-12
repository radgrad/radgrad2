import React from 'react';
import _ from 'lodash';
import { CareerGoal, Course, Interest, Opportunity, StudentProfile } from '../../../app/imports/typings/radgrad';
import * as Router from '../../../app/imports/ui/components/shared/utilities/router';
import { Users } from '../../../app/imports/api/user/UserCollection';
import { OpportunityInstances } from '../../../app/imports/api/opportunity/OpportunityInstanceCollection';
import { EXPLORER_TYPE } from '../../../app/imports/ui/layouts/utilities/route-constants';
import { AcademicTerms } from '../../../app/imports/api/academic-term/AcademicTermCollection';
import PreferredChoice from '../../../app/imports/api/degree-plan/PreferredChoice';
import { StudentProfiles } from '../../../app/imports/api/user/StudentProfileCollection';
import { Opportunities } from '../../../app/imports/api/opportunity/OpportunityCollection';
import { profileGetCareerGoalIDs } from '../../../app/imports/ui/components/shared/utilities/data-model';
import { defaultProfilePicture } from '../../../app/imports/api/user/BaseProfileCollection';
import { ProfileCareerGoals } from '../../../app/imports/api/user/profile-entries/ProfileCareerGoalCollection';
import { ProfileInterests } from '../../../app/imports/api/user/profile-entries/ProfileInterestCollection';
import { ProfileOpportunities } from '../../../app/imports/api/user/profile-entries/ProfileOpportunityCollection';
import { MatchProps } from '../../../app/imports/ui/components/shared/utilities/router';

export type ExplorerInterfaces = CareerGoal | Course | Interest | Opportunity;

export type IExplorerTypes = 'plans' | 'career-goals' | 'courses' | 'interests' | 'opportunities';

export const isType = (typeToCheck: string, type: IExplorerTypes): boolean => type === typeToCheck;

/* ####################################### ACADEMIC PLANS HELPER FUNCTIONS ####################################### */
export const interestedStudents = (item: { _id: string }, type: string): StudentProfile[] => {
  const interested = [];
  let profiles = StudentProfiles.findNonRetired({ isAlumni: false });

  if (type === EXPLORER_TYPE.CAREERGOALS) {
    profiles = profiles.filter((profile) => {
      const userID = profile.userID;
      const favCareerGoals = ProfileCareerGoals.findNonRetired({ userID });
      const favIDs = favCareerGoals.map((fav) => fav.careerGoalID);
      return _.includes(favIDs, item._id);
    });
  } else if (type === EXPLORER_TYPE.INTERESTS) {
    profiles = profiles.filter((profile) => {
      const userID = profile.userID;
      const favInterests = ProfileInterests.findNonRetired({ userID });
      const favIDs = favInterests.map((fav) => fav.interestID);
      return _.includes(favIDs, item._id);
    });
  }
  profiles = profiles.filter((profile) => profile.picture && profile.picture !== defaultProfilePicture);
  profiles.forEach((p) => {
    if (!_.includes(interested, p.userID)) {
      // interested.push(p.userID);
      interested.push(p);
    }
  });
  // only allow 50 students randomly selected.
  for (let i = interested.length - 1; i >= 50; i--) {
    interested.splice(Math.floor(Math.random() * interested.length), 1);
  }
  return interested;
};

/* ####################################### CAREER GOALS HELPER FUNCTIONS ######################################### */
export const noCareerGoals = (match: Router.MatchProps): boolean => {
  const username = Router.getUsername(match);
  if (username) {
    const profile = Users.getProfile(username);
    return profileGetCareerGoalIDs(profile).length === 0;
  }
  return true;
};

/* ####################################### INTERESTS HELPER FUNCTIONS ############################################ */
export const userInterests = (interest: Interest, match: Router.MatchProps): string => {
  let ret = '';
  const profile = Users.getProfile(Router.getUsername(match));
  if (_.includes(Users.getInterestIDs(profile.userID), interest._id)) {
    ret = 'check green circle outline icon';
  }
  return ret;
};

export const noInterests = (match: Router.MatchProps): boolean => {
  const username = Router.getUsername(match);
  if (username) {
    const profile = Users.getProfile(username);
    const interestIDs = Users.getInterestIDs(profile.userID);
    return interestIDs.length === 0;
  }
  return true;
};

/* ####################################### OPPORTUNITIES HELPER FUNCTIONS ######################################## */
export const availableOpps = (match: MatchProps): unknown[] => {
  const notRetired = Opportunities.findNonRetired({});
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  // console.log(notRetired.length);
  if (Router.isUrlRoleStudent(match)) {
    const studentID = Router.getUserIdFromRoute(match);
    if (notRetired.length > 0) {
      let filteredOpps = notRetired.filter((opp) => {
        const oi = OpportunityInstances.findNonRetired({
          studentID,
          opportunityID: opp._id,
        });
        return oi.length === 0;
      });
      // console.log('first filter ', filteredOpps.length);
      filteredOpps = filteredOpps.filter((opp) => {
        let inFuture = false;
        opp.termIDs.forEach((termID) => {
          const term = AcademicTerms.findDoc(termID);
          if (term.termNumber >= currentTerm.termNumber) {
            inFuture = true;
          }
        });
        return inFuture;
      });
      // console.log('second filter ', filteredOpps.length);
      const profileEntries = ProfileOpportunities.findNonRetired({ studentID });
      const favIDs = profileEntries.map((fav) => fav.opportunityID);
      filteredOpps = filteredOpps.filter((f) => !_.includes(favIDs, f._id));
      // console.log('third filter ', filteredOpps.length);
      return filteredOpps;
    }
  } else if (Router.isUrlRoleFaculty(match)) {
    return notRetired.filter((o) => o.sponsorID !== Router.getUserIdFromRoute(match));
  }
  return notRetired;
};

export const matchingOpportunities = (match: MatchProps): Opportunity[] => {
  const allOpportunities = availableOpps(match);
  // console.log('allOpportunities ', allOpportunities);
  const username = Router.getUsername(match);
  const profile = Users.getProfile(username);
  const interestIDs = Users.getInterestIDs(profile.userID);
  const preferred = new PreferredChoice(allOpportunities, interestIDs);
  return preferred.getOrderedChoices();
};

/* ####################################### GENERAL HELPER FUNCTIONS ############################################ */

export const noItems = (noItemsType: string, match: Router.MatchProps): boolean => {
  switch (noItemsType) {
    case 'noInterests':
      return noInterests(match);
    case 'noCareerGoals':
      return noCareerGoals(match);
    default:
      return true;
  }
};

export const buildNoItemsMessage = (noItemsMessageType, type: IExplorerTypes): Element | JSX.Element | string => {
  switch (noItemsMessageType) {
    case 'noInterests':
      if (isType(EXPLORER_TYPE.CAREERGOALS, type)) {
        return <p>Add interests to your profile to see sorted Career Goals. To add Interests to your profile,
          select &quot;Interests&quot; in the dropdown on the left.</p>;
      }
      if (isType(EXPLORER_TYPE.COURSES, type)) {
        return <p>Add interests to your profile to see sorted Courses. To add Interests to your profile,
          select &quot;Interests&quot; in the dropdown menu on the left.</p>;
      }
      if (isType(EXPLORER_TYPE.INTERESTS, type)) {
        return (
          <p>
            You have not added any Interests or Career Goals to your profile. To add Interests, click on &quot;View
            More&quot; to view the details for an Interest and add to profile from there. To add Career Goals,
            select &quot;Career Goals&quot; in the dropdown menu on the left.
          </p>
        );
      }
      if (isType(EXPLORER_TYPE.OPPORTUNITIES, type)) {
        return <p>Add interests to your profile to see sorted Opportunities. To add Interests,
          select &quot;Interests&quot; in the dropdown menu on the left.</p>;
      }
      return '';
    case 'noCareerGoals':
      return <p>You have not added any Career Goals to your profile. To add Career Goals, click on &quot;View More&quot; to view the details for a Career Goal and add them from there.</p>;
    default:
      console.error(`Bad noItemsMessageType: ${noItemsMessageType}`);
      return undefined;
  }
};

export const checkForNoItems = (match: MatchProps, type: IExplorerTypes): Element | JSX.Element | string => {
  switch (type) {
    case EXPLORER_TYPE.CAREERGOALS:
      return (
        <React.Fragment>
          {noItems('noInterests', match) ? buildNoItemsMessage('noInterests', type) : ''}
          {noItems('noCareerGoals', match) ? buildNoItemsMessage('noCareerGoals', type) : ''}
        </React.Fragment>
      );
    case EXPLORER_TYPE.COURSES:
      return noItems('noInterests', match) ? buildNoItemsMessage('noInterests', type) : '';
    case EXPLORER_TYPE.INTERESTS:
      return noItems('noInterests', match) ? buildNoItemsMessage('noInterests', type) : '';
    case EXPLORER_TYPE.OPPORTUNITIES:
      return noItems('noInterests', match) ? buildNoItemsMessage('noInterests', type) : '';
    default:
      return '';
  }
};
