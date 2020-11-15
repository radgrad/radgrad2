import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentIceWidget from '../../components/student/ice-page/StudentIceWidget';
import withInstanceSubscriptions from '../../layouts/utilities/InstanceSubscriptionsHOC';
import withGlobalSubscription from '../../layouts/utilities/GlobalSubscriptionsHOC';

const StudentIcePage = () => (
  <div id="student-ice-points-page">
    <StudentPageMenuWidget />
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}><HelpPanelWidget /></Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16} stretched>
            <StudentIceWidget />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <BackToTopButton />
    </Container>
  </div>
);

const StudentHomeIcePageCon = withGlobalSubscription(StudentIcePage);
const StudentHomeIcePageContainer = withInstanceSubscriptions(StudentHomeIcePageCon);

export default StudentHomeIcePageContainer;
