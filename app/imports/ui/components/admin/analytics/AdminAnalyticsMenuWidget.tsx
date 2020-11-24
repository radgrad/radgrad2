import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { buildRouteName } from '../../shared/utilities/router';
import { ANALYTICS } from '../../../layouts/utilities/route-constants';

const AdminAnalyticsMenuWidget = () => {
  const match = useRouteMatch();
  return (
    <div>
      <Menu vertical text>
        <Menu.Item as={NavLink} exact to={buildRouteName(match, `/${ANALYTICS.HOME}`)}>
          Logged In Users
        </Menu.Item>
        <Menu.Item as={NavLink} exact to={buildRouteName(match, `/${ANALYTICS.HOME}/${ANALYTICS.NEWSLETTER}`)}>
          Newsletter
        </Menu.Item>
        <Menu.Item as={NavLink} exact to={buildRouteName(match, `/${ANALYTICS.HOME}/${ANALYTICS.OVERHEADANALYSIS}`)}>
          Overhead Analysis
        </Menu.Item>
        <Menu.Item as={NavLink} exact to={buildRouteName(match, `/${ANALYTICS.HOME}/${ANALYTICS.STUDENTSUMMARY}`)}>
          Student Summary
        </Menu.Item>
        <Menu.Item as={NavLink} exact to={buildRouteName(match, `/${ANALYTICS.HOME}/${ANALYTICS.USERINTERACTIONS}`)}>
          User Interactions
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default AdminAnalyticsMenuWidget;
