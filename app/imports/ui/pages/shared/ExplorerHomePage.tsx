import * as React from 'react';
import { Dropdown, Grid } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';

interface IExplorerHomePageProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class ExplorerHomePage extends React.Component<IExplorerHomePageProps> {
  constructor(props) {
    super(props);
  }

  private getRoleByUrl = (): string => {
    const url = this.props.match.url;
    const username = this.props.match.params.username;
    const indexUsername = url.indexOf(username);
    return url.substring(1, indexUsername - 1);
  }

  private renderPageMenuWidget = (): JSX.Element => {
    const role = this.getRoleByUrl();
    switch (role) {
      case 'student':
        return <StudentPageMenuWidget/>;
      case 'mentor':
        return <MentorPageMenuWidget/>;
      case 'faculty':
        return <FacultyPageMenuWidget/>;
      default:
        return <React.Fragment/>;
    }
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const helpMessage = HelpMessages.findDoc({ routeName: this.props.match.path });
    const menuItems = [
      { key: 'Academic Plans', route: 'plans' },
      { key: 'Career Goals', route: 'career-goals' },
      { key: 'Courses', route: 'courses' },
      { key: 'Degrees', route: 'degrees' },
      { key: 'Interests', route: 'interests' },
      { key: 'Opportunities', route: 'opportunities' },
      { key: 'Users', route: 'users' },
    ];

    const baseUrl = this.props.match.url;
    const username = this.props.match.params.username;
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}`;
    const menuOptions = menuItems.map((item) => ({
      key: item.key,
      text: item.key,
      as: NavLink,
      exact: true,
      to: `${baseRoute}/explorer/${item.route}`,
      style: { textDecoration: 'none' },
    }));

    return (
      <React.Fragment>
        {this.renderPageMenuWidget()}
        <Grid container={true} stackable={true}>
          <Grid.Row>
            {helpMessage ? <HelpPanelWidget/> : ''}
          </Grid.Row>

          <Grid.Column width={3}>
            <Dropdown selection={true} fluid={true} options={menuOptions} text="Select Explorer"/>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

const ExplorerHomePageCon = withGlobalSubscription(ExplorerHomePage);
const ExplorerHomePageContainer = withInstanceSubscriptions(ExplorerHomePageCon);

export default ExplorerHomePageContainer;
