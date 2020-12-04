import React from 'react';
import _ from 'lodash';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import { IAcademicPlan, ICareerGoal, ICourse, IInterest, IOpportunity } from '../../../../../typings/radgrad';
import { Users } from '../../../../../api/user/UserCollection';
import { CourseInstances } from '../../../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../../../api/opportunity/OpportunityInstanceCollection';
import * as Router from '../../utilities/router';
import { itemToSlugName, profileGetCareerGoalIDs, profileGetFavoriteAcademicPlanIDs } from '../../utilities/data-model';

type explorerInterfaces = IAcademicPlan | ICareerGoal | ICourse | IInterest | IOpportunity;

interface IExplorerMenuMobileItemProps {
  type: any;
  listItem: any;
}

const itemName = (item: { item: explorerInterfaces, count: number }): string => {
  const countStr = `x${item.count}`;
  if (item.count > 1) {
    return `${item.item.name} ${countStr}`;
  }
  return `${item.item.name}`;
};

const userPlans = (plan: IAcademicPlan, match): string => {
  let ret = '';
  const profile = Users.getProfile(Router.getUsername(match));
  if (_.includes(profileGetFavoriteAcademicPlanIDs(profile), plan._id)) {
    ret = 'check green circle outline icon';
  }
  return ret;
};
const userCareerGoals = (careerGoal: ICareerGoal, match): string => {
  let ret = '';
  const profile = Users.getProfile(Router.getUsername(match));
  if (_.includes(profileGetCareerGoalIDs(profile), careerGoal._id)) {
    ret = 'check green circle outline icon';
  }
  return ret;
};

const userCourses = (course: ICourse, match): string => {
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

const courseName = (course: { item: ICourse, count: number }): string => {
  const countStr = `x${course.count}`;
  if (course.count > 1) {
    return `${course.item.shortName} ${countStr}`;
  }
  return `${course.item.shortName}`;
};

const userInterests = (interest: IInterest, match): string => {
  let ret = '';
  const profile = Users.getProfile(Router.getUsername(match));
  if (_.includes(Users.getInterestIDs(profile.userID), interest._id)) {
    ret = 'check green circle outline icon';
  }
  return ret;
};

const userOpportunities = (opportunity: IOpportunity, match): string => {
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

// Determines whether or not we show a "check green circle outline icon" for an item
const getItemStatus = (item: explorerInterfaces, props: IExplorerMenuMobileItemProps, match): string => {
  const { type } = props;
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      return userPlans(item as IAcademicPlan, match);
    case EXPLORER_TYPE.CAREERGOALS:
      return userCareerGoals(item as ICareerGoal, match);
    case EXPLORER_TYPE.COURSES:
      return userCourses(item as ICourse, match);
    case EXPLORER_TYPE.INTERESTS:
      return userInterests(item as IInterest, match);
    case EXPLORER_TYPE.OPPORTUNITIES:
      return userOpportunities(item as IOpportunity, match);
    default:
      return '';
  }
};

const ExplorerMenuMobileItem: React.FC<IExplorerMenuMobileItemProps> = (props) => {
  const { type, listItem } = props;
  const match = useRouteMatch();
  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    marginLeft: '-20px',
  };

  return (
    <Dropdown.Item
      as={NavLink}
      exact
      to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${type}/${itemToSlugName(listItem.item)}`)}
      text={(
        <React.Fragment>
          <i className={getItemStatus(listItem.item, props, match)} style={iconStyle} />
          {
                         type !== EXPLORER_TYPE.COURSES ?
                           itemName(listItem)
                           : courseName(listItem as { item: ICourse, count: number })
                       }
        </React.Fragment>
                   )}
    />
  );
};

export default ExplorerMenuMobileItem;
