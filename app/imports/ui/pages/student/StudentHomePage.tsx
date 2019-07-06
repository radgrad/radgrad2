import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import StudentHomeMenu from '../../components/student/StudentHomeMenu';
import StudentHomeWidget from '../../components/student/StudentHomeWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';

// TODO: Back to Top Button

/** A simple static component to render some text for the landing page. */
class StudentHomePage extends React.Component {
  public render() {
    return (
      <div className="layout-page">
        <StudentPageMenuWidget/>
        <Grid verticalAlign="middle" container={true}>
          <Grid.Row>
            <HelpPanelWidgetContainer/>
          </Grid.Row>

          <Grid.Column width={2}>
            <StudentHomeMenu/>
          </Grid.Column>

          <Grid.Column width={14}>
            <StudentHomeWidget/>
          </Grid.Column>

        </Grid>
        <div>Back to Top Button</div>
      </div>
    );
  }
}

const StudentHomePageCon = withGlobalSubscription(StudentHomePage);
const StudentHomePageContainer = withInstanceSubscriptions(StudentHomePageCon);

export default StudentHomePageContainer;
