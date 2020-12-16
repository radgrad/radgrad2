import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { Users } from '../../../api/user/UserCollection';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import HelpPanelWidget, { HelpPanelWidgetProps } from '../../components/shared/HelpPanelWidget';
import StudentLogWidget, { StudentLogWidgetProps } from '../../components/student/log/StudentLogWidget';

interface StudentHomeLogPageProps extends HelpPanelWidgetProps, StudentLogWidgetProps {}

const StudentHomeLogPage: React.FC<StudentHomeLogPageProps> = ({ advisorLogs, helpMessages }) => (
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
            <StudentLogWidget advisorLogs={advisorLogs} />
          </Grid.Column>
          <Grid.Column width={2} />
        </Grid.Row>
      </Grid>
      <BackToTopButton />
    </Container>
  </div>
);

const StudentHomeLogPageContainer = withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username);
  const advisorLogs = AdvisorLogs.findNonRetired({ studentID: profile.userID });
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    advisorLogs,
    helpMessages,
  };
})(StudentHomeLogPage);

export default StudentHomeLogPageContainer;
