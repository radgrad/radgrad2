import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import HelpPanelWidget, { IHelpPanelWidgetProps } from '../../components/shared/HelpPanelWidget';
import StudentLogWidget from '../../components/student/log/StudentLogWidget';

const StudentHomeLogPage: React.FC<IHelpPanelWidgetProps> = ({ helpMessages }) => (
  <div id="student-advisor-log-page">
    <StudentPageMenuWidget />
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={2} />
          <Grid.Column width={12}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          <Grid.Column width={2} />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={2} />
          <Grid.Column width={12} stretched>
            <StudentLogWidget />
          </Grid.Column>
          <Grid.Column width={2} />
        </Grid.Row>
      </Grid>
      <BackToTopButton />
    </Container>
  </div>
);

const StudentHomeLogPageContainer = withTracker(() => {
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    helpMessages,
  };
})(StudentHomeLogPage);

export default StudentHomeLogPageContainer;
