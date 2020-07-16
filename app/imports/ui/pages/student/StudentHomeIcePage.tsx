import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentIceWidget from '../../components/student/StudentIceWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';

const StudentHomeIcePage = () => (
  <div>
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

const StudentHomeIcePageCon = withGlobalSubscription(StudentHomeIcePage);
const StudentHomeIcePageContainer = withInstanceSubscriptions(StudentHomeIcePageCon);

export default StudentHomeIcePageContainer;
