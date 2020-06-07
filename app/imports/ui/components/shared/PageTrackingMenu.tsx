import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import {
  PageInterestsCategoryTypes,
} from '../../../api/page-tracking/PageInterestsCategoryTypes';
import { buildRouteName, IMatchProps } from './RouterHelperFunctions';
import { PAGE_TRACKING_COMPARISON, PAGE_TRACKING_SCOREBOARD } from '../../../startup/client/route-constants';

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

const getRoute = (match: IMatchProps, type: PageTrackingMenuTypes, key: string) => {
  if (type === 'scoreboard') {
    return buildRouteName(match, `/${PAGE_TRACKING_SCOREBOARD}/${key}`);
  }
  return buildRouteName(match, `/${PAGE_TRACKING_COMPARISON}/${key}`);
};

const PageTrackingMenu = (props: IPageTrackingScoreboardMenuProps) => {
  const { match, type } = props;
  return (
    <Menu vertical>
      {menuItems.map((item) => (
        <Menu.Item
          key={item.key}
          as={NavLink}
          content={item.text}
          to={type === 'scoreboard' ?
            getRoute(match, 'scoreboard', item.key) : getRoute(match, 'comparison', item.key)}
        />
      ))}
    </Menu>
  );
};

const PageTrackingScoreboardMenuContainer = withRouter(PageTrackingMenu);
export default PageTrackingScoreboardMenuContainer;
