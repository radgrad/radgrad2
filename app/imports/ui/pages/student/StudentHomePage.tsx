import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentHomeMenu from '../../components/student/StudentHomeMenu';
import StudentHomeWidget from '../../components/student/StudentHomeWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

class StudentHomePage extends React.Component {
  public render() {
    return (
      <div>
        <StudentPageMenuWidget/>
        <Grid container={true} stackable={true}>
          <Grid.Row>
            <HelpPanelWidget/>
          </Grid.Row>

          <Grid.Column width={2}>
            <StudentHomeMenu/>
          </Grid.Column>

          <Grid.Column width={14}>
            <StudentHomeWidget/>
          </Grid.Column>

        </Grid>

        <BackToTopButton/>
      </div>
    );
  }
}

const StudentHomePageCon = withGlobalSubscription(StudentHomePage);
const StudentHomePageContainer = withInstanceSubscriptions(StudentHomePageCon);

export default StudentHomePageContainer;
