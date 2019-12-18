import * as React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { buildRouteName } from '../shared/RouterHelperFunctions';
import { ANALYTICS } from '../../../startup/client/routes-config';
import { IRadGradMatch } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars

interface IAdminAnalyticsMenuWidgetProps {
  match: IRadGradMatch;
}

class AdminAnalyticsMenuWidget extends React.Component<IAdminAnalyticsMenuWidgetProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const { match } = this.props;
    return (
      <div>
        <Menu text={true} vertical={true}>
          <Menu.Item as={NavLink} to={buildRouteName(match, `/${ANALYTICS.HOME}`)}>Logged In Users</Menu.Item>
          <Menu.Item as={NavLink}
                     to={buildRouteName(match, `/${ANALYTICS.HOME}/${ANALYTICS.NEWSLETTER}`)}>Newsletter</Menu.Item>
          <Menu.Item as={NavLink} to={buildRouteName(match, `/${ANALYTICS.HOME}/${ANALYTICS.OVERHEADANALYSIS}`)}>Overhead
            Analysis</Menu.Item>
          <Menu.Item as={NavLink} to={buildRouteName(match, `/${ANALYTICS.HOME}/${ANALYTICS.STUDENTSUMMARY}`)}>Student
            Summary</Menu.Item>
          <Menu.Item as={NavLink} to={buildRouteName(match, `/${ANALYTICS.HOME}/${ANALYTICS.USERINTERACTIONS}`)}>User
            Interactions</Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default withRouter(AdminAnalyticsMenuWidget);
