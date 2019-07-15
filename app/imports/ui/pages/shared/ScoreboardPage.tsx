import * as React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import * as Router from '../../components/shared/RouterHelperFunctions';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import ScoreboardPageMenu from '../../components/shared/ScoreboardPageMenu';
import { COURSE_SCOREBOARD, OPPORTUNITY_SCOREBOARD } from '../../../startup/client/routes-config';
import CourseScoreboardWidget from '../../components/shared/CourseScoreboardWidget';
import OpportunityScoreboardWidgetContainer from '../../components/shared/OpportunityScoreboardWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

export interface IScoreboardPageProps {
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
    // console.log(this.props);
    let content = <Message>Choose a scoreboard from the menu to the left.</Message>;
    if (this.props.match.path.indexOf(COURSE_SCOREBOARD) !== -1) {
      content = <CourseScoreboardWidget/>;
    }
    if (this.props.match.path.indexOf(OPPORTUNITY_SCOREBOARD) !== -1) {
      content = <OpportunityScoreboardWidgetContainer/>;
    }
    // console.log(this.props.match.path, COURSE_SCOREBOARD, OPPORTUNITY_SCOREBOARD);
    return (
      <React.Fragment>
        {this.renderPageMenuWidget()}
        <Grid container={true} stackable={true} padded={'vertically'}>
          <Grid.Row>
            <HelpPanelWidget/>
          </Grid.Row>

          <Grid.Column width={3}>
            <ScoreboardPageMenu/>
          </Grid.Column>
          <Grid.Column width={13}>
            {content}
          </Grid.Column>
        </Grid>

        <BackToTopButton/>
      </React.Fragment>
    );
  }
}

export default ScoreboardPage;
