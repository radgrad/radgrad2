import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentHomeMenu from '../../components/student/StudentHomeMenu';
import BackToTopButton from '../../components/shared/BackToTopButton';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import StudentAboutMeWidget from '../../components/student/StudentAboutMeWidget';

const StudentHomeAboutMePage = () => (
  <div>
    <StudentPageMenuWidget />
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={2} />
          <Grid.Column width={12}>
            <StudentAboutMeWidget />
          </Grid.Column>
          <Grid.Column width={2} />
        </Grid.Row>
      </Grid>
    </Container>
    <BackToTopButton />
  </div>
);

const StudentHomeAboutMePageCon = withGlobalSubscription(StudentHomeAboutMePage);
const StudentHomeAboutMePageContainer = withInstanceSubscriptions(StudentHomeAboutMePageCon);

export default StudentHomeAboutMePageContainer;
