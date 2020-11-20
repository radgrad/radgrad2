import * as React from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { Button, Menu } from 'semantic-ui-react';

import {
  PageInterestsCategoryTypes,
} from '../../../../api/page-tracking/PageInterestsCategoryTypes';
import { buildRouteName, IMatchProps } from '../utilities/router';
import { PAGE_TRACKING_COMPARISON, PAGE_TRACKING_SCOREBOARD } from '../../../layouts/utilities/route-constants';

type PageTrackingMenuTypes = 'scoreboard' | 'comparison';

interface IPageTrackingScoreboardMenuProps {
  match: IMatchProps
  type: PageTrackingMenuTypes;
}

const menuItems = [
  { key: PageInterestsCategoryTypes.CAREERGOAL, text: 'Career Goals' },
  { key: PageInterestsCategoryTypes.COURSE, text: 'Courses' },
  { key: PageInterestsCategoryTypes.INTEREST, text: 'Interests' },
  { key: PageInterestsCategoryTypes.OPPORTUNITY, text: 'Opportunities' },
];

const getMenuItemRoute = (match: IMatchProps, type: PageTrackingMenuTypes, key: string) => {
  if (type === 'scoreboard') {
    return buildRouteName(match, `/${PAGE_TRACKING_SCOREBOARD}/${key}`);
  }
  return buildRouteName(match, `/${PAGE_TRACKING_COMPARISON}/${key}`);
};

const getButtonRoute = (match: IMatchProps, type: PageTrackingMenuTypes, key: string) => {
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

const PageTrackingMenu = (props: IPageTrackingScoreboardMenuProps) => {
  const { match, type } = props;
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

const PageTrackingScoreboardMenuContainer = withRouter(PageTrackingMenu);
export default PageTrackingScoreboardMenuContainer;