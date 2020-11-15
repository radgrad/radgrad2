import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/utilities/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/utilities/InstanceSubscriptionsHOC';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentLogWidget from '../../components/student/log-page/StudentLogWidget';

const StudentHomeLogPage = () => (
  <div id="student-advisor-log-page">
    <StudentPageMenuWidget />
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={2} />
          <Grid.Column width={12}><HelpPanelWidget /></Grid.Column>
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

const StudentHomeLogPageCon = withGlobalSubscription(StudentHomeLogPage);
const StudentHomeLogPageContainer = withInstanceSubscriptions(StudentHomeLogPageCon);

export default StudentHomeLogPageContainer;
