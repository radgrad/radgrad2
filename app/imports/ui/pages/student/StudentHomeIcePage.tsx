import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentHomeMenu from '../../components/student/StudentHomeMenu';
import StudentIceWidget from '../../components/student/StudentIceWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';

const StudentHomeIcePage = () => (
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
          <StudentIceWidget/>
        </Grid.Column>
        <Grid.Column width={1}/>
      </Grid.Row>
    </Grid>

    <BackToTopButton/>
  </div>
);

const StudentHomeIcePageCon = withGlobalSubscription(StudentHomeIcePage);
const StudentHomeIcePageContainer = withInstanceSubscriptions(StudentHomeIcePageCon);

export default StudentHomeIcePageContainer;
