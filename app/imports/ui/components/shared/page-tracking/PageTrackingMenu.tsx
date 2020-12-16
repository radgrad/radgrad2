import React from 'react';
import { NavLink, Link, useRouteMatch } from 'react-router-dom';
import { Button, Menu } from 'semantic-ui-react';

import {
  PageInterestsCategoryTypes,
} from '../../../../api/page-tracking/PageInterestsCategoryTypes';
import { buildRouteName, MatchProps } from '../utilities/router';
import { PAGE_TRACKING_COMPARISON, PAGE_TRACKING_SCOREBOARD } from '../../../layouts/utilities/route-constants';

type PageTrackingMenuTypes = 'scoreboard' | 'comparison';

interface PageTrackingScoreboardMenuProps {
  type: PageTrackingMenuTypes;
}

const menuItems = [
  { key: PageInterestsCategoryTypes.CAREERGOAL, text: 'Career Goals' },
  { key: PageInterestsCategoryTypes.COURSE, text: 'Courses' },
  { key: PageInterestsCategoryTypes.INTEREST, text: 'Interests' },
  { key: PageInterestsCategoryTypes.OPPORTUNITY, text: 'Opportunities' },
];

const getMenuItemRoute = (match: MatchProps, type: PageTrackingMenuTypes, key: string) => {
  if (type === 'scoreboard') {
    return buildRouteName(match, `/${PAGE_TRACKING_SCOREBOARD}/${key}`);
  }
  return buildRouteName(match, `/${PAGE_TRACKING_COMPARISON}/${key}`);
};

const getButtonRoute = (match: MatchProps, type: PageTrackingMenuTypes, key: string) => {
  if (type === 'scoreboard') {
    return buildRouteName(match, `/${PAGE_TRACKING_COMPARISON}/${key}`);
  }
  return buildRouteName(match, `/${PAGE_TRACKING_SCOREBOARD}/${key}`);
};

const getButtonText = (type: PageTrackingMenuTypes) => {
  if (type === 'scoreboard') {
    return 'Go To Comparison Page';
  }
  return 'Go to Scoreboard Page';
};

const PageTrackingMenu: React.FC<PageTrackingScoreboardMenuProps> = ({ type }) => {
  const match = useRouteMatch();
  const buttonText = getButtonText(type);
  const buttonRoute = getButtonRoute(match, type, PageInterestsCategoryTypes.CAREERGOAL);
  return (
    <>
      <Button as={Link} to={buttonRoute}>{buttonText}</Button>
      <Menu vertical>
        {menuItems.map((item) => (
          <Menu.Item key={item.key} as={NavLink} content={item.text} to={getMenuItemRoute(match, type, item.key)} />
        ))}
      </Menu>
    </>
  );
};

export default PageTrackingMenu;
