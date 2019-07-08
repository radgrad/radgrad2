import * as React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import * as Router from '../../components/shared/RouterHelperFunctions';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';

interface IScoreboardPageProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class ScoreboardPage extends React.Component<IScoreboardPageProps> {

  constructor(props) {
    super(props);
  }

  private getRoleByUrl = (): string => Router.getRoleByUrl(this.props.match);

  private renderPageMenuWidget = (): JSX.Element => {
    const role = this.getRoleByUrl();
    switch (role) {
      case 'advisor':
        return <AdvisorPageMenuWidget/>;
      case 'admin':
        return <AdminPageMenuWidget/>;
      case 'faculty':
        return <FacultyPageMenuWidget/>;
      default:
        return <React.Fragment/>;
    }
  };


  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <React.Fragment>
        {this.renderPageMenuWidget()}
        <Grid container={true} stackable={true}>
          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={14}>
              <HelpPanelWidget/>
            </Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>
          <Grid.Column width={3}>
            Scoreboard nav dropdown
          </Grid.Column>
          <Grid.Column width={13}>
            <Message>Choose a scoreboard from the menu to the left.</Message>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

const ScoreboardPageCon = withGlobalSubscription(ScoreboardPage);
const ScoreboardPageContainer = withInstanceSubscriptions(ScoreboardPageCon);

export default ScoreboardPageContainer;
