import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import * as Router from '../../components/shared/RouterHelperFunctions';
import ExplorerNavDropdown from '../../components/shared/ExplorerNavDropdown';

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

  private getRoleByUrl = (): string => Router.getRoleByUrl(this.props.match);

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
    return (
      <React.Fragment>
        {this.renderPageMenuWidget()}
        <Grid container={true} stackable={true}>
          <Grid.Row>
            <HelpPanelWidget/>
          </Grid.Row>

          <Grid.Column width={3}>
            <ExplorerNavDropdown match={this.props.match} text="Select Explorer"/>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

const ExplorerHomePageCon = withGlobalSubscription(ExplorerHomePage);
const ExplorerHomePageContainer = withInstanceSubscriptions(ExplorerHomePageCon);

export default ExplorerHomePageContainer;
