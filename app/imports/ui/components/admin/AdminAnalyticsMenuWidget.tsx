import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { buildRouteName } from '../shared/RouterHelperFunctions';
import { ANALYTICS } from '../../../startup/client/route-constants';

interface IAdminAnalyticsMenuWidgetProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const AdminAnalyticsMenuWidget = (props: IAdminAnalyticsMenuWidgetProps) => {
  const { match } = props;
  return (
    <div>
      <Menu vertical>
        <Menu.Item as={NavLink} exact to={buildRouteName(match, `/${ANALYTICS.HOME}`)}>Logged In Users</Menu.Item>
        <Menu.Item
          as={NavLink}
          exact
          to={buildRouteName(match, `/${ANALYTICS.HOME}/${ANALYTICS.NEWSLETTER}`)}
        >
          Newsletter
        </Menu.Item>
        <Menu.Item as={NavLink} exact to={buildRouteName(match, `/${ANALYTICS.HOME}/${ANALYTICS.OVERHEADANALYSIS}`)}>
          Overhead
          Analysis
        </Menu.Item>
        <Menu.Item as={NavLink} exact to={buildRouteName(match, `/${ANALYTICS.HOME}/${ANALYTICS.STUDENTSUMMARY}`)}>
          Student
          Summary
        </Menu.Item>
        <Menu.Item as={NavLink} exact to={buildRouteName(match, `/${ANALYTICS.HOME}/${ANALYTICS.USERINTERACTIONS}`)}>
          User
          Interactions
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default withRouter(AdminAnalyticsMenuWidget);
