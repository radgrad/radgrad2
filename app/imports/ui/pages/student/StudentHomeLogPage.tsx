import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentHomeMenu from '../../components/student/StudentHomeMenu';
import StudentLogWidget from '../../components/student/StudentLogWidget';

const StudentHomeLogPage = () => (
  <div>
    <StudentPageMenuWidget/>
    <Grid stackable={true}>
      <Grid.Row>
        <Grid.Column width={1}/>
        <Grid.Column width={14}><HelpPanelWidget/></Grid.Column>
        <Grid.Column width={1}/>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={1}/>
        <Grid.Column width={3}>
          <StudentHomeMenu/>
        </Grid.Column>

        <Grid.Column width={11} stretched={true}>
          <StudentLogWidget/>
        </Grid.Column>
        <Grid.Column width={1}/>
      </Grid.Row>
    </Grid>

    <BackToTopButton/>
  </div>
);

const StudentHomeLogPageCon = withGlobalSubscription(StudentHomeLogPage);
const StudentHomeLogPageContainer = withInstanceSubscriptions(StudentHomeLogPageCon);

export default StudentHomeLogPageContainer;
