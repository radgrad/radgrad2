import * as _ from 'lodash';
import { IAcademicPlan, ICareerGoal } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import * as Router from './RouterHelperFunctions';
import { Users } from '../../../api/user/UserCollection';

/* ####################################### ACADEMIC PLANS HELPER FUNCTIONS ####################################### */
export const userPlans = (plan: IAcademicPlan, match: Router.IMatchProps): string => {
  let ret = '';
  const profile = Users.getProfile(Router.getUsername(match));
  if (_.includes(profile.academicPlanID, plan._id)) {
    ret = 'check green circle outline icon';
  }
  return ret;
};

/* ####################################### CAREER GOALS HELPER FUNCTIONS ######################################### */
export const userCareerGoals = (careerGoal: ICareerGoal, match: Router.IMatchProps): string => {
  let ret = '';
  const profile = Users.getProfile(Router.getUsername(match));
  if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
    ret = 'check green circle outline icon';
  }
  return ret;
};
