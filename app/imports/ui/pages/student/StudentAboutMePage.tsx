import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import StudentAboutMeWidget from '../../components/student/about-me-page/StudentAboutMeWidget';

const StudentAboutMePage = () => (
  <div id="student-about-me-page">
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

const StudentAboutMePageCon = withGlobalSubscription(StudentAboutMePage);
const StudentAboutMePageContainer = withInstanceSubscriptions(StudentAboutMePageCon);

export default StudentAboutMePageContainer;
