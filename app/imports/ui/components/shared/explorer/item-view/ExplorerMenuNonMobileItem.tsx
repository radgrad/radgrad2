import React from 'react';
import _ from 'lodash';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import * as Router from '../../utilities/router';
import { CareerGoal, Course, Interest, Opportunity } from '../../../../../typings/radgrad';
import { Users } from '../../../../../api/user/UserCollection';
import { CourseInstances } from '../../../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../../../api/opportunity/OpportunityInstanceCollection';
import { itemToSlugName, profileGetCareerGoalIDs } from '../../utilities/data-model';
import { ExplorerInterfaces, ListItem } from './ExplorerMenuMobileItem';

interface ExplorerMenuNonMobileItemProps {
  type: string;
  listItem: ListItem;
}

const itemName = (item: ListItem): string => {
  const countStr = `x${item.count}`;
  if (item.count > 1) {
    return `${item.item.name} ${countStr}`;
  }
  return `${item.item.name}`;
};

const userCareerGoals = (careerGoal: CareerGoal, match): string => {
  let ret = '';
  const profile = Users.getProfile(Router.getUsername(match));
  if (_.includes(profileGetCareerGoalIDs(profile), careerGoal._id)) {
    ret = 'check green circle outline icon';
  }
  return ret;
};

const userCourses = (course: Course, match): string => {
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

const courseName = (course: { item: Course, count: number }): string => {
  const countStr = `x${course.count}`;
  if (course.count > 1) {
    return `${course.item.shortName} ${countStr}`;
  }
  return `${course.item.shortName}`;
};

const userInterests = (interest: Interest, match): string => {
  let ret = '';
  const profile = Users.getProfile(Router.getUsername(match));
  if (_.includes(Users.getInterestIDs(profile.userID), interest._id)) {
    ret = 'check green circle outline icon';
  }
  return ret;
};

const userOpportunities = (opportunity: Opportunity, match): string => {
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

const opportunityItemName = (item: { item: Opportunity, count: number }): string => {
  const countStr = `x${item.count}`;
  const iceString = `(${item.item.ice.i}/${item.item.ice.c}/${item.item.ice.e})`;
  if (item.count > 1) {
    return `${item.item.name} ${iceString} ${countStr}`;
  }
  return `${item.item.name} ${iceString}`;
};

// Determines whether or not we show a "check green circle outline icon" for an item
const getItemStatus = (item: ExplorerInterfaces, props: ExplorerMenuNonMobileItemProps): string => {
  const { type } = props;
  switch (type) {
    case EXPLORER_TYPE.CAREERGOALS:
      return userCareerGoals(item as CareerGoal, props);
    case EXPLORER_TYPE.COURSES:
      return userCourses(item as Course, props);
    case EXPLORER_TYPE.INTERESTS:
      return userInterests(item as Interest, props);
    case EXPLORER_TYPE.OPPORTUNITIES:
      return userOpportunities(item as Opportunity, props);
    default:
      return '';
  }
};

const ExplorerMenuNonMobileItem: React.FC<ExplorerMenuNonMobileItemProps> = ({ type, listItem }) => {
  const match = useRouteMatch();
  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    marginLeft: '-20px',
  };

  return (
    <Menu.Item
      as={NavLink}
      exact
      to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${type}/${itemToSlugName(listItem.item)}`)}
    >
      <i className={getItemStatus(listItem.item, match)} style={iconStyle} />
      {type === EXPLORER_TYPE.OPPORTUNITIES && opportunityItemName(listItem as { item: Opportunity, count: number })}
      {type === EXPLORER_TYPE.COURSES && courseName(listItem as { item: Course, count: number })}
      {(type !== EXPLORER_TYPE.COURSES && type !== EXPLORER_TYPE.OPPORTUNITIES) && itemName(listItem)}
    </Menu.Item>
  );
};

export default ExplorerMenuNonMobileItem;
