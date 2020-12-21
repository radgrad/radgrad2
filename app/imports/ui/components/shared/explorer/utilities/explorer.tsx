import React from 'react';
import _ from 'lodash';
import {
  CareerGoal,
  Course,
  Interest,
  Opportunity,
  StudentProfile,
} from '../../../../../typings/radgrad';
import * as Router from '../../utilities/router';
import { Users } from '../../../../../api/user/UserCollection';
import { OpportunityInstances } from '../../../../../api/opportunity/OpportunityInstanceCollection';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import PreferredChoice from '../../../../../api/degree-plan/PreferredChoice';
import { StudentProfiles } from '../../../../../api/user/StudentProfileCollection';
import { Opportunities } from '../../../../../api/opportunity/OpportunityCollection';
import {
  profileGetCareerGoalIDs,
} from '../../utilities/data-model';
import { defaultProfilePicture } from '../../../../../api/user/BaseProfileCollection';
import { FavoriteCareerGoals } from '../../../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteInterests } from '../../../../../api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../../../../api/favorite/FavoriteOpportunityCollection';
import { MatchProps } from '../../utilities/router';

export type ExplorerInterfaces = CareerGoal | Course | Interest | Opportunity;

export type IExplorerTypes = 'plans' | 'career-goals' | 'courses' | 'interests' | 'opportunities';

export const isType = (typeToCheck: string, type: IExplorerTypes): boolean => type === typeToCheck;

/* ####################################### ACADEMIC PLANS HELPER FUNCTIONS ####################################### */
export const interestedStudents = (item: { _id: string }, type: string): StudentProfile[] => {
  const interested = [];
  let profiles = StudentProfiles.findNonRetired({ isAlumni: false });

  if (type === EXPLORER_TYPE.CAREERGOALS) {
    profiles = _.filter(profiles, (profile) => {
      const userID = profile.userID;
      const favCareerGoals = FavoriteCareerGoals.findNonRetired({ userID });
      const favIDs = _.map(favCareerGoals, (fav) => fav.careerGoalID);
      return _.includes(favIDs, item._id);
    });
  } else if (type === EXPLORER_TYPE.INTERESTS) {
    profiles = _.filter(profiles, (profile) => {
      const userID = profile.userID;
      const favInterests = FavoriteInterests.findNonRetired({ userID });
      const favIDs = _.map(favInterests, (fav) => fav.interestID);
      return _.includes(favIDs, item._id);
    });
  }
  profiles = _.filter(profiles, (profile) => profile.picture && profile.picture !== defaultProfilePicture);
  _.forEach(profiles, (p) => {
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
      let filteredOpps = _.filter(notRetired, (opp) => {
        const oi = OpportunityInstances.findNonRetired({
          studentID,
          opportunityID: opp._id,
        });
        return oi.length === 0;
      });
      // console.log('first filter ', filteredOpps.length);
      filteredOpps = _.filter(filteredOpps, (opp) => {
        let inFuture = false;
        _.forEach(opp.termIDs, (termID) => {
          const term = AcademicTerms.findDoc(termID);
          if (term.termNumber >= currentTerm.termNumber) {
            inFuture = true;
          }
        });
        return inFuture;
      });
      // console.log('second filter ', filteredOpps.length);
      const favorites = FavoriteOpportunities.findNonRetired({ studentID });
      const favIDs = _.map(favorites, (fav) => fav.opportunityID);
      filteredOpps = _.filter(filteredOpps, (f) => !_.includes(favIDs, f._id));
      // console.log('third filter ', filteredOpps.length);
      return filteredOpps;
    }
  } else if (Router.isUrlRoleFaculty(match)) {
    return _.filter(notRetired, o => o.sponsorID !== Router.getUserIdFromRoute(match));
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
        return (
          <p>
            Favorite interests to see sorted Career Goals. To favorite Interests, select &quot;Interests&quot; in the
            dropdown on the left.
          </p>
        );
      }
      if (isType(EXPLORER_TYPE.COURSES, type)) {
        return (
          <p>
            Favorite interests to see sorted Courses. To favorite Interests, select &quot;Interests&quot; in the
            dropdown menu on the left.
          </p>
        );
      }
      if (isType(EXPLORER_TYPE.INTERESTS, type)) {
        return (
          <p>
            You have not favorited any Interests or Career Goals. To favorite Interests, click on &quot;View
            More&quot; to view the details for an Interest and favorite from there. To favorite Career Goals,
            select &quot;Career Goals&quot; in the dropdown menu on the left.
          </p>
        );
      }
      if (isType(EXPLORER_TYPE.OPPORTUNITIES, type)) {
        return (
          <p>
            Favorite interests to see sorted Opportunities. To favorite Interests, select &quot;Interests&quot; in the
            dropdown menu on the left.
          </p>
        );
      }
      return '';
    case 'noCareerGoals':
      return (
        <p>You have not favorited any Career Goals. To favorite Career Goals, click on &quot;View More&quot; to view the
          details for a Career Goal and favorite from there.
        </p>
      );
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
