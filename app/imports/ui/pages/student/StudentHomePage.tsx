import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';

/** A simple static component to render some text for the landing page. */
class StudentHomePage extends React.Component {
  public render() {
    return (
      <div>
        <StudentPageMenuWidget/>
        <Grid verticalAlign="middle" container={true}>
          <Grid.Row textAlign="left">
            <HelpPanelWidget/>
          </Grid.Row>
          <Grid.Column width={4}>
            <Image size="small" circular={true} src="/images/radgrad_logo.png"/>
          </Grid.Column>

          <Grid.Column width={8}>
            <h1>Student Home</h1>
          </Grid.Column>

        </Grid>
      </div>
    );
  }
}

const StudentHomePageCon = withGlobalSubscription(StudentHomePage);
const StudentHomePageContainer = withInstanceSubscriptions(StudentHomePageCon);

export default StudentHomePageContainer;
