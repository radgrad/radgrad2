import * as React from 'react';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { Segment, Menu } from 'semantic-ui-react';

interface IAdminAnalyticsMenuWidget {
  match: {
    params: {
      username: string,
    }
    isExact: boolean,
    url: string,
  }

}

class AdminAnalyticsMenuWidget extends React.Component<IAdminAnalyticsMenuWidget> {
  constructor(props) {
    super(props)
    console.log('Admin Analytics Menu Widget props constructor', props)
  }

  private buildRoute = (slug) => {
    console.log('menu widget url', this.props.match.url);
    let helper: any = this.props.match.url.split('/');
    console.log(helper);
    const urlList = [helper[1], helper[2], helper[3], slug];
    helper = urlList.join('/');
    return `/${helper}`;
  }

  public render() {
    console.log('Admin Analytics Menu Widget props', this.props);
    let slug;
    console.log(slug);
    return (
      <div>
        <Menu text vertical>
          <Menu.Item as={NavLink} to={this.buildRoute('')} active={false}>Logged In Users</Menu.Item>
          <Menu.Item as={NavLink} to={this.buildRoute('newsletter')}>Newsletter</Menu.Item>
          <Menu.Item as={NavLink} to={this.buildRoute('overhead-analysis')}>Overhead Analysis</Menu.Item>
          <Menu.Item as={NavLink} to={this.buildRoute('student-summary')}>Student Summary</Menu.Item>
          <Menu.Item as={NavLink} to={this.buildRoute('user-interactions')}>User Interactions</Menu.Item>

        </Menu>
      </div>
    )
  }
}

export default withRouter(AdminAnalyticsMenuWidget);
