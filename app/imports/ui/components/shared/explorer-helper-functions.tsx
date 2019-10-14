import * as _ from 'lodash';
import { Roles } from 'meteor/alanning:roles';
import { IAcademicPlan, ICareerGoal, ICourse, IDesiredDegree, IInterest, IOpportunity } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import * as Router from './RouterHelperFunctions';
import { Users } from '../../../api/user/UserCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import PreferredChoice from '../../../api/degree-plan/PreferredChoice';
import { Courses } from '../../../api/course/CourseCollection';
import { ROLE } from '../../../api/role/Role';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Interests } from '../../../api/interest/InterestCollection';

export type explorerInterfaces = IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity;

export interface ICardExplorerMenuWidgetProps {
  menuAddedList: { item: explorerInterfaces, count: number }[];
  menuCareerList: { item: IInterest, count: number }[] | undefined;
  type: 'plans' | 'career-goals' | 'courses' | 'degrees' | 'interests' | 'opportunities' | 'users';
  role: 'student' | 'faculty' | 'mentor';
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

export const isType = (typeToCheck: string, props: { type: string }) => {
  const { type } = props;
  return type === typeToCheck;
};


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
    case EXPLORER_TYPE.USERS:
      return 'USERS';
    default:
      return 'UNDEFINED TITLE';
  }
};


/* ####################################### ACADEMIC PLANS HELPER FUNCTIONS ####################################### */
export const userPlans = (plan: IAcademicPlan, match: Router.IMatchProps): string => {
  let ret = '';
  const profile = Users.getProfile(Router.getUsername(match));
  if (_.includes(profile.academicPlanID, plan._id)) {
    ret = 'check green circle outline icon';
  }
  return ret;
};

export const noPlan = (match: Router.IMatchProps): boolean => {
  const username = Router.getUsername(match);
  if (Router.isUrlRoleStudent(match)) {
    if (username) {
      return _.isNil(Users.getProfile(username).academicPlanID);
    }
  }
  return false;
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
      plans = _.filter(AcademicPlans.find({ termNumber: { $gte: declaredTerm.termNumber } }, {
        sort: {
          year: 1,
          name: 1,
        },
      }).fetch(), (ap) => !ap.retired);
    }
    if (profile.academicPlanID) {
      return _.filter(plans, p => profile.academicPlanID !== p._id);
    }
  }
  return plans;
};

export const academicPlansItemCount = (match: Router.IMatchProps): number => availableAcademicPlans(match).length;


/* ####################################### CAREER GOALS HELPER FUNCTIONS ######################################### */
export const userCareerGoals = (careerGoal: ICareerGoal, match: Router.IMatchProps): string => {
  let ret = '';
  const profile = Users.getProfile(Router.getUsername(match));
  if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
    ret = 'check green circle outline icon';
  }
  return ret;
};

export const availableCareerGoals = (match: Router.IMatchProps): object[] => {
  const careers = CareerGoals.findNonRetired({});
  const username = Router.getUsername(match);
  if (username) {
    const profile = Users.getProfile(username);
    const careerGoalIDs = profile.careerGoalIDs;
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
    return profile.careerGoalIDs.length === 0;
  }
  return true;
};


/* ####################################### COURSES HELPER FUNCTIONS ############################################## */
export const userCourses = (course: ICourse, match: Router.IMatchProps): string => {
  let ret = '';
  const ci = CourseInstances.find({
    studentID: Router.getUserIdFromRoute(match),
    courseID: course._id,
  }).fetch();
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
    let filtered = _.filter(courses, (course) => {
      if (course.number === 'ICS 499') { // TODO: hardcoded ICS string
        return true;
      }
      const ci = CourseInstances.find({
        studentID,
        courseID: course._id,
      }).fetch();
      return ci.length === 0;
    });
    if (Roles.userIsInRole(studentID, [ROLE.STUDENT])) {
      const profile = StudentProfiles.findDoc({ userID: studentID });
      const plan = AcademicPlans.findDoc(profile.academicPlanID);
      if (plan.coursesPerAcademicTerm.length < 15) { // not bachelors and masters
        const regex = /[1234]\d\d/g;
        filtered = _.filter(filtered, (c) => c.num.match(regex));
      }
    }
    return filtered;
  }
  return [];
};

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
  let interests = Interests.find({}).fetch();
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
  const oi = OpportunityInstances.find({
    studentID: Router.getUserIdFromRoute(match),
    opportunityID: opportunity._id,
  }).fetch();
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

/* ####################################### GENERAL HELPER FUNCTIONS ############################################ */

// Determines whether or not we show a "check green circle outline icon" for an item
export const getItemStatus = (item: explorerInterfaces, match: Router.IMatchProps): string => {
  const { type } = this.props;
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      return userPlans(item as IAcademicPlan, match);
    case EXPLORER_TYPE.CAREERGOALS:
      return userCareerGoals(item as ICareerGoal, match);
    case EXPLORER_TYPE.COURSES:
      return userCourses(item as ICourse, match);
    // case 'degrees': users currently cannot add a desired degree to their profile
    //   return this.userDegrees(item.item as DesiredDegree);
    case EXPLORER_TYPE.INTERESTS:
      return userInterests(item as IInterest, match);
    case EXPLORER_TYPE.OPPORTUNITIES:
      return userOpportunities(item as IOpportunity, match);
    case EXPLORER_TYPE.USERS: // do nothing
      return '';
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
      return this.coursesItemCount();
    case EXPLORER_TYPE.DEGREES:
      return this.degreesItemCount();
    case EXPLORER_TYPE.INTERESTS:
      return this.interestsItemCount();
    case EXPLORER_TYPE.OPPORTUNITIES:
      return this.opportunitiesItemCount();
    case EXPLORER_TYPE.USERS:
      // do nothing; we do not track user count
      return -1;
    default:
      return -1;
  }
};

export const buildHeader = (props: ICardExplorerMenuWidgetProps): { title: string; count: number; } => {
  const header = {
    title: getHeaderTitle(props),
    count: getHeaderCount(props),
  };
  return header;
};


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
