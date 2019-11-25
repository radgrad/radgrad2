import * as React from 'react';
import * as _ from 'lodash';
import { NavLink } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
// eslint-disable-next-line no-unused-vars
import { IAcademicPlan, ICareerGoal, ICourse, IDesiredDegree, IInterest, IOpportunity } from '../../../typings/radgrad';
import { Users } from '../../../api/user/UserCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import * as Router from './RouterHelperFunctions';
import { itemToSlugName, profileGetCareerGoalIDs } from './data-model-helper-functions';

type explorerInterfaces = IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity;

interface IExplorerMenuMobileItemProps {
  type: any;
  listItem: any;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const itemName = (item: { item: explorerInterfaces, count: number }): string => {
  const countStr = `x${item.count}`;
  if (item.count > 1) {
    return `${item.item.name} ${countStr}`;
  }
  return `${item.item.name}`;
};

const userPlans = (plan: IAcademicPlan, props: IExplorerMenuMobileItemProps): string => {
  let ret = '';
  const profile = Users.getProfile(Router.getUsername(props.match));
  if (_.includes(profile.academicPlanID, plan._id)) {
    ret = 'check green circle outline icon';
  }
  return ret;
};
const userCareerGoals = (careerGoal: ICareerGoal, props: IExplorerMenuMobileItemProps): string => {
  let ret = '';
  const profile = Users.getProfile(Router.getUsername(props.match));
  if (_.includes(profileGetCareerGoalIDs(profile), careerGoal._id)) {
    ret = 'check green circle outline icon';
  }
  return ret;
};

const userCourses = (course: ICourse, props: IExplorerMenuMobileItemProps): string => {
  let ret = '';
  const ci = CourseInstances.find({
    studentID: Router.getUserIdFromRoute(props.match),
    courseID: course._id,
  }).fetch();
  if (ci.length > 0) {
    ret = 'check green circle outline icon';

  }
  return ret;
};

const courseName = (course: { item: ICourse, count: number }): string => {
  const countStr = `x${course.count}`;
  if (course.count > 1) {
    return `${course.item.shortName} ${countStr}`;
  }
  return `${course.item.shortName}`;
};

const userInterests = (interest: IInterest, props: IExplorerMenuMobileItemProps): string => {
  let ret = '';
  const profile = Users.getProfile(Router.getUsername(props.match));
  if (_.includes(Users.getInterestIDs(profile.userID), interest._id)) {
    ret = 'check green circle outline icon';
  }
  return ret;
};

const userOpportunities = (opportunity: IOpportunity, props: IExplorerMenuMobileItemProps): string => {
  let ret = '';
  const oi = OpportunityInstances.find({
    studentID: Router.getUserIdFromRoute(props.match),
    opportunityID: opportunity._id,
  }).fetch();
  if (oi.length > 0) {
    ret = 'check green circle outline icon';

  }
  return ret;
};

// Determines whether or not we show a "check green circle outline icon" for an item
const getItemStatus = (item: explorerInterfaces, props: IExplorerMenuMobileItemProps): string => {
  const { type } = props;
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      return userPlans(item as IAcademicPlan, props);
    case EXPLORER_TYPE.CAREERGOALS:
      return userCareerGoals(item as ICareerGoal, props);
    case EXPLORER_TYPE.COURSES:
      return userCourses(item as ICourse, props);
    // case 'degrees': users currently cannot add a desired degree to their profile
    //   return userDegrees(item.item as DesiredDegree);
    case EXPLORER_TYPE.INTERESTS:
      return userInterests(item as IInterest, props);
    case EXPLORER_TYPE.OPPORTUNITIES:
      return userOpportunities(item as IOpportunity, props);
    case EXPLORER_TYPE.USERS: // do nothing
      return '';
    default:
      return '';
  }
};

const ExplorerMenuMobileItem = (props: IExplorerMenuMobileItemProps) => {
  const { type, listItem, match } = props;
  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    marginLeft: '-20px',
  };

  return (
    <Dropdown.Item as={NavLink} exact={true}
                   to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${type}/${itemToSlugName(listItem.item)}`)}
                   text={(
                     <React.Fragment>
                       <i className={getItemStatus(listItem.item, props)} style={iconStyle}/>
                       {
                         type !== EXPLORER_TYPE.COURSES ?
                           itemName(listItem)
                           : courseName(listItem as { item: ICourse, count: number })
                       }
                     </React.Fragment>
                   )}/>
  );
};

export default ExplorerMenuMobileItem;
