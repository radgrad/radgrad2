import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { IHelpMessage } from '../../../typings/radgrad';
import { IMatchProps } from '../../components/shared/utilities/router';
import * as Router from '../../components/shared/utilities/router';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import ScoreboardPageMenu from '../../components/shared/scoreboard/ScoreboardPageMenu';
import { COURSE_SCOREBOARD, OPPORTUNITY_SCOREBOARD } from '../../layouts/utilities/route-constants';
import CourseScoreboardWidget from '../../components/shared/scoreboard/CourseScoreboardWidget';
import OpportunityScoreboardWidgetContainer from '../../components/shared/scoreboard/OpportunityScoreboardWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

export interface IScoreboardPageProps {
  helpMessages: IHelpMessage[];
}

const renderPageMenuWidget = (match: IMatchProps): JSX.Element => {
  const role = Router.getRoleByUrl(match);
  switch (role) {
    case 'advisor':
      return <AdvisorPageMenuWidget />;
    case 'admin':
      return <AdminPageMenuWidget />;
    case 'faculty':
      return <FacultyPageMenuWidget />;
    default:
      return <React.Fragment />;
  }
};

const ScoreboardPage: React.FC<IScoreboardPageProps> = ({ helpMessages }) => {
  const match = useRouteMatch();
  let content = <Message>Choose a scoreboard from the menu to the left.</Message>;
  if (match.path.indexOf(COURSE_SCOREBOARD) !== -1) {
    content = <CourseScoreboardWidget />;
  }
  if (match.path.indexOf(OPPORTUNITY_SCOREBOARD) !== -1) {
    content = <OpportunityScoreboardWidgetContainer />;
  }
  return (
    <React.Fragment>
      {renderPageMenuWidget(match)}
      <Grid id="scoreboard-page" container stackable padded="vertically">
        <Grid.Row>
          <HelpPanelWidget helpMessages={helpMessages} />
        </Grid.Row>

        <Grid.Column width={3}>
          <ScoreboardPageMenu />
        </Grid.Column>
        <Grid.Column width={13}>
          {content}
        </Grid.Column>
      </Grid>

      <BackToTopButton />
    </React.Fragment>
  );
};

const ScoreboardPageContainer = withTracker(() => {
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    helpMessages,
  };
})(ScoreboardPage);

export default ScoreboardPageContainer;
