import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { buildRouteName } from '../utilities/router';
import {
  COURSE_SCOREBOARD,
  OPPORTUNITY_SCOREBOARD,
  PAGE_TRACKING_COMPARISON,
  PAGE_TRACKING_SCOREBOARD,
  SCOREBOARD,
} from '../../../layouts/utilities/route-constants';
import { leftHandMenu } from '../shared-widget-names';
import { PageInterestsCategoryTypes } from '../../../../api/page-tracking/PageInterestsCategoryTypes';

const menuItems = [
  { key: 'courses', text: 'Courses', route: `/${SCOREBOARD}/${COURSE_SCOREBOARD}` },
  { key: 'opportunities', text: 'Opportunities', route: `/${SCOREBOARD}/${OPPORTUNITY_SCOREBOARD}` },
  {
    key: 'page-tracking',
    text: 'Page Tracking Scoreboard',
    route: `/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.CAREERGOAL}`,
  },
  {
    key: 'page-comparison',
    text: 'Page Tracking Comparison',
    route: `/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.CAREERGOAL}`,
  },
];

const ScoreboardPageMenu = (): JSX.Element => {
  const match = useRouteMatch();
  const menuOptions = menuItems.map((item) => (
    <Menu.Item
      key={item.key}
      as={NavLink}
      exact
      to={buildRouteName(match, item.route)}
    >
      {item.text}
    </Menu.Item>
  ));
  return (
    <Menu vertical fluid id={`${leftHandMenu}`}>
      {menuOptions}
    </Menu>
  );
};

export default ScoreboardPageMenu;
