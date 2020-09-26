import React from 'react';
import _ from 'lodash';
import {
  IAcademicPlan, IBaseProfile,
  ICareerGoal,
  ICourse,
  IDesiredDegree,
  IInterest,
  IOpportunity,
  IStudentProfile,
} from '../../../typings/radgrad';
import * as Router from './RouterHelperFunctions';
import { Users } from '../../../api/user/UserCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import PreferredChoice from '../../../api/degree-plan/PreferredChoice';
import { Courses } from '../../../api/course/CourseCollection';
import { ROLE } from '../../../api/role/Role';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import {
  profileFavoriteBamAcademicPlan,
  profileGetCareerGoalIDs,
  profileGetFavoriteAcademicPlanIDs,
  profileGetFavoriteAcademicPlans,
} from './data-model-helper-functions';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { IMatchProps } from './RouterHelperFunctions';

export type explorerInterfaces = IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity;

export interface ICardExplorerMenuWidgetProps {
  menuAddedList: { item: explorerInterfaces, count: number }[];
  menuCareerList: { item: IInterest, count: number }[] | undefined;
  type: 'plans' | 'career-goals' | 'courses' | 'degrees' | 'interests' | 'opportunities' | 'users';
  role: 'student' | 'faculty';
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

export type IExplorerTypes = 'plans' | 'career-goals' | 'courses' | 'degrees' | 'interests' | 'opportunities';

export const isType = (typeToCheck: string, type: IExplorerTypes) => type === typeToCheck;

export const getHeaderTitle = (props: { type: string }): string => {
  const { type } = props;
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      return 'ACADEMIC PLANS';
    case EXPLORER_TYPE.CAREERGOALS:
      return 'CAREER GOALS';
    case EXPLORER_TYPE.COURSES:
      return 'COURSES';
    case EXPLORER_TYPE.DEGREES:
      return 'DESIRED DEGREES';
    case EXPLORER_TYPE.INTERESTS:
      return 'INTERESTS';
    case EXPLORER_TYPE.OPPORTUNITIES:
      return 'OPPORTUNITIES';
    default:
      return 'UNDEFINED TITLE';
  }
};

/* ####################################### ACADEMIC PLANS HELPER FUNCTIONS ####################################### */
export const userPlans = (plan: IAcademicPlan, match: Router.IMatchProps): string => {
  let ret = '';
  const profile = Users.getProfile(Router.getUsername(match));
  if (_.includes(profileGetFavoriteAcademicPlanIDs(profile), plan._id)) {
    ret = 'check green circle outline icon';
  }
  return ret;
};

export const noPlan = (match: Router.IMatchProps): boolean => {
  const profile = Users.getProfile(Router.getUsername(match));
  return profileGetFavoriteAcademicPlans(profile).length === 0;
};

export const availableAcademicPlans = (match: Router.IMatchProps): object[] => {
  let plans = AcademicPlans.findNonRetired({}, { sort: { year: 1, name: 1 } });
  const username = Router.getUsername(match);
  if (username) {
    const profile = Users.getProfile(username);
    if (!profile.declaredAcademicTermID) {
      plans = AcademicPlans.getLatestPlans();
    } else {
      const declaredTerm = AcademicTerms.findDoc(profile.declaredAcademicTermID);
      plans = AcademicPlans.findNonRetired({ termNumber: { $gte: declaredTerm.termNumber } }, {
        sort: {
          year: 1,
          name: 1,
        },
      });
    }
    const profilePlanIDs = profileGetFavoriteAcademicPlanIDs(profile);
    // console.log(plans, profilePlanIDs, _.filter(plans, p => !_.includes(profilePlanIDs, p._id)));
    return _.filter(plans, p => !_.includes(profilePlanIDs, p._id));
  }
  return plans;
};

export const academicPlansItemCount = (match: Router.IMatchProps): number => availableAcademicPlans(match).length;

export const interestedStudents = (item: { _id: string }, type: string): IStudentProfile[] => {
  const interested = [];
  let profiles = StudentProfiles.findNonRetired({ isAlumni: false });

  if (type === EXPLORER_TYPE.ACADEMICPLANS) {
    profiles = _.filter(profiles, (profile) => {
      const studentID = profile.userID;
      const favPlans = FavoriteAcademicPlans.findNonRetired({ studentID });
      const favIDs = _.map(favPlans, (fav) => fav.academicPlanID);
      return _.includes(favIDs, item._id);
    });
  } else if (type === EXPLORER_TYPE.CAREERGOALS) {
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
      interested.push(p.userID);
    }
  });
  // only allow 50 students randomly selected.
  for (let i = interested.length - 1; i >= 50; i--) {
    interested.splice(Math.floor(Math.random() * interested.length), 1);
  }
  return interested;
};

/* ####################################### CAREER GOALS HELPER FUNCTIONS ######################################### */
export const userCareerGoals = (careerGoal: ICareerGoal, match: Router.IMatchProps): string => {
  let ret = '';
  const profile = Users.getProfile(Router.getUsername(match));
  if (_.includes(profileGetCareerGoalIDs(profile), careerGoal._id)) {
    ret = 'check green circle outline icon';
  }
  return ret;
};

const availableCareerGoals = (match: Router.IMatchProps): object[] => {
  const careers = CareerGoals.findNonRetired({});
  const username = Router.getUsername(match);
  if (username) {
    const profile = Users.getProfile(username);
    const careerGoalIDs = profileGetCareerGoalIDs(profile);
    return _.filter(careers, c => !_.includes(careerGoalIDs, c._id));
  }
  return careers;
};

export const matchingCareerGoals = (match: Router.IMatchProps): object[] => {
  const allCareers = availableCareerGoals(match);
  const username = Router.getUsername(match);
  if (username) {
    const profile = Users.getProfile(username);
    const interestIDs = Users.getInterestIDs(profile.userID);
    const preferred = new PreferredChoice(allCareers, interestIDs);
    return preferred.getOrderedChoices();
  }
  return allCareers;
};

export const careerGoalsItemCount = (match: Router.IMatchProps): number => matchingCareerGoals(match).length;

export const noCareerGoals = (match: Router.IMatchProps): boolean => {
  const username = Router.getUsername(match);
  if (username) {
    const profile = Users.getProfile(username);
    return profileGetCareerGoalIDs(profile).length === 0;
  }
  return true;
};

/* ####################################### COURSES HELPER FUNCTIONS ############################################## */
export const userCourses = (course: ICourse, match: Router.IMatchProps): string => {
  let ret = '';
  const ci = CourseInstances.findNonRetired({
    studentID: Router.getUserIdFromRoute(match),
    courseID: course._id,
  });
  if (ci.length > 0) {
    ret = 'check green circle outline icon';

  }
  return ret;
};

export const courseName = (course: { item: ICourse, count: number }): string => {
  const countStr = `x${course.count}`;
  if (course.count > 1) {
    return `${course.item.shortName} ${countStr}`;
  }
  return `${course.item.shortName}`;
};

export const availableCourses = (match: Router.IMatchProps): object[] => {
  const courses = Courses.findNonRetired({});
  if (courses.length > 0) {
    const studentID = Router.getUserIdFromRoute(match);
    const profile = Users.getProfile(studentID);
    let filtered = _.filter(courses, (course) => {
      if (course.num === 'ICS 499') { // TODO: hardcoded ICS string
        return true;
      }
      const ci = CourseInstances.findNonRetired({
        studentID,
        courseID: course._id,
      });
      return ci.length === 0;
    });
    if (profile.role === ROLE.STUDENT) {
      const bam = profileFavoriteBamAcademicPlan(profile);
      if (!bam) { // not bachelors and masters
        const regex = /[1234]\d\d/g;
        filtered = _.filter(filtered, (c) => c.num.match(regex));
      }
    }
    const favorites = FavoriteCourses.findNonRetired({ studentID });
    const favIDs = _.map(favorites, (fav) => fav.courseID);
    filtered = _.filter(filtered, (f) => !_.includes(favIDs, f._id));
    return filtered;
  }
  return [];
};

export const matchingCourses = (match: Router.IMatchProps): object[] => {
  const username = Router.getUsername(match);
  if (username) {
    const allCourses = availableCourses(match);
    const profile = Users.getProfile(username);
    const interestIDs = Users.getInterestIDs(profile.userID);
    const preferred = new PreferredChoice(allCourses, interestIDs);
    return preferred.getOrderedChoices();
  }
  return [];
};

export const coursesItemCount = (match: Router.IMatchProps): number => availableCourses(match).length;

/* ####################################### DEGREES HELPER FUNCTIONS ####################################### */
export const degrees = (): object[] => DesiredDegrees.findNonRetired({}, { sort: { name: 1 } });

export const degreesItemCount = (): number => degrees().length;

/* ####################################### INTERESTS HELPER FUNCTIONS ############################################ */
export const userInterests = (interest: IInterest, match: Router.IMatchProps): string => {
  let ret = '';
  const profile = Users.getProfile(Router.getUsername(match));
  if (_.includes(Users.getInterestIDs(profile.userID), interest._id)) {
    ret = 'check green circle outline icon';
  }
  return ret;
};

export const noInterests = (match: Router.IMatchProps): boolean => {
  const username = Router.getUsername(match);
  if (username) {
    const profile = Users.getProfile(username);
    const interestIDs = Users.getInterestIDs(profile.userID);
    return interestIDs.length === 0;
  }
  return true;
};

export const availableInterests = (match: Router.IMatchProps): object[] => {
  let interests = Interests.findNonRetired({});
  const username = Router.getUsername(match);
  if (username) {
    const profile = Users.getProfile(username);
    const allInterests = Users.getInterestIDsByType(profile.userID);
    interests = _.filter(interests, i => !_.includes(allInterests[0], i._id));
    interests = _.filter(interests, i => !_.includes(allInterests[1], i._id));
  }
  return interests;
};

export const interestsItemCount = (match: Router.IMatchProps): number => availableInterests(match).length;

/* ####################################### OPPORTUNITIES HELPER FUNCTIONS ######################################## */
export const userOpportunities = (opportunity: IOpportunity, match: Router.IMatchProps): string => {
  let ret = '';
  const oi = OpportunityInstances.findNonRetired({
    studentID: Router.getUserIdFromRoute(match),
    opportunityID: opportunity._id,
  });
  if (oi.length > 0) {
    ret = 'check green circle outline icon';

  }
  return ret;
};

export const opportunityItemName = (item: { item: IOpportunity, count: number }): string => {
  const countStr = `x${item.count}`;
  const iceString = `(${item.item.ice.i}/${item.item.ice.c}/${item.item.ice.e})`;
  if (item.count > 1) {
    return `${item.item.name} ${iceString} ${countStr}`;
  }
  return `${item.item.name} ${iceString}`;
};

export const availableOpps = (match: IMatchProps): object[] => {
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

export const matchingOpportunities = (match: IMatchProps): IOpportunity[] => {
  const allOpportunities = availableOpps(match);
  // console.log('allOpportunities ', allOpportunities);
  const username = Router.getUsername(match);
  const profile = Users.getProfile(username);
  const interestIDs = Users.getInterestIDs(profile.userID);
  const preferred = new PreferredChoice(allOpportunities, interestIDs);
  return preferred.getOrderedChoices();
};

const opportunitiesItemCount = (match: IMatchProps) => availableOpps(match).length;

/* ####################################### USERS HELPER FUNCTIONS ####################################### */
export const getUsers = (role: string, match: Router.IMatchProps): IBaseProfile[] => {
  const username = Router.getUsername(match);
  let users: IBaseProfile[] = Users.findProfilesWithRole(role, {}, { sort: { lastName: 1 } });
  if (role === ROLE.STUDENT) {
    users = _.filter(users, (user) => user.optedIn);
  }

  if (username) {
    const profile = Users.getProfile(username);
    // const filtered = _.filter(users, (u) => u.username !== profile.username);
    const interestIDs = Users.getInterestIDs(profile.userID);
    // const preferred = new PreferredChoice(filtered, interestIDs);
    const preferred = new PreferredChoice(users, interestIDs);
    return preferred.getOrderedChoices();
  }
  return users;
};

/* ####################################### GENERAL HELPER FUNCTIONS ############################################ */

// Determines whether or not we show a "check green circle outline icon" for an item
export const getItemStatus = (item: explorerInterfaces, props: ICardExplorerMenuWidgetProps): string => {
  const { type } = props;
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      return userPlans(item as IAcademicPlan, props.match);
    case EXPLORER_TYPE.CAREERGOALS:
      return userCareerGoals(item as ICareerGoal, props.match);
    case EXPLORER_TYPE.COURSES:
      return userCourses(item as ICourse, props.match);
    // case 'degrees': users currently cannot add a desired degree to their profile
    //   return this.userDegrees(item.item as DesiredDegree);
    case EXPLORER_TYPE.INTERESTS:
      return userInterests(item as IInterest, props.match);
    case EXPLORER_TYPE.OPPORTUNITIES:
      return userOpportunities(item as IOpportunity, props.match);
    default:
      return '';
  }
};

export const getHeaderCount = (props: ICardExplorerMenuWidgetProps): number => {
  const { type } = props;
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      return academicPlansItemCount(props.match);
    case EXPLORER_TYPE.CAREERGOALS:
      return careerGoalsItemCount(props.match);
    case EXPLORER_TYPE.COURSES:
      return coursesItemCount(props.match);
    case EXPLORER_TYPE.DEGREES:
      return degreesItemCount();
    case EXPLORER_TYPE.INTERESTS:
      return interestsItemCount(props.match);
    case EXPLORER_TYPE.OPPORTUNITIES:
      return opportunitiesItemCount(props.match);
    default:
      return -1;
  }
};

export const buildHeader = (props: ICardExplorerMenuWidgetProps): { title: string; count: number; } => ({
  title: getHeaderTitle(props),
  count: getHeaderCount(props),
});

export const noItems = (noItemsType: string, match: Router.IMatchProps): boolean => {
  switch (noItemsType) {
    case 'noPlan':
      return noPlan(match);
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
    case 'noPlan':
      return (
        <p>
          You have not favorited any Academic Plans. To favorite academic plans, click on &quot;View More&quot;
          to view the details for an Academic Plan and favorite from there.
        </p>
      );
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

export const checkForNoItems = (match: IMatchProps, type: IExplorerTypes): Element | JSX.Element | string => {
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      return noItems('noPlan', match) ? buildNoItemsMessage('noPlan', type) : '';
    case EXPLORER_TYPE.CAREERGOALS:
      return (
        <React.Fragment>
          {noItems('noInterests', match) ? buildNoItemsMessage('noInterests', type) : ''}
          {noItems('noCareerGoals', match) ? buildNoItemsMessage('noCareerGoals', type) : ''}
        </React.Fragment>
      );
    case EXPLORER_TYPE.COURSES:
      return noItems('noInterests', match) ? buildNoItemsMessage('noInterests', type) : '';
    case EXPLORER_TYPE.DEGREES:
      //  do nothing; users cannot add their own desired degrees to their profile
      return '';
    case EXPLORER_TYPE.INTERESTS:
      return noItems('noInterests', match) ? buildNoItemsMessage('noInterests', type) : '';
    case EXPLORER_TYPE.OPPORTUNITIES:
      return noItems('noInterests', match) ? buildNoItemsMessage('noInterests', type) : '';
    default:
      return '';

  }
};

export const getItems = (props: ICardExplorerMenuWidgetProps): { [key: string]: any }[] => {
  const { type, match } = props;
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      return availableAcademicPlans(match);
    case EXPLORER_TYPE.CAREERGOALS:
      return matchingCareerGoals(match);
    case EXPLORER_TYPE.COURSES:
      return availableCourses(match);
    case EXPLORER_TYPE.DEGREES:
      return degrees();
    case EXPLORER_TYPE.INTERESTS:
      return availableInterests(match);
    case EXPLORER_TYPE.OPPORTUNITIES:
      return matchingOpportunities(match);
    default:
      return [];
  }
};
