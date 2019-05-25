import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import StudentHomeMenu from '../../components/student/StudentHomeMenu';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentHomeWidget from '../../components/student/StudentHomeWidget';

// TODO: StudentHomeMenu: the different pages for each menu item
// TODO: StudentHomeMenu: mobile version of the menu (dropdown)
// TODO: HelpPanelWidget
// TODO: Student Home Widget
// TODO: Back to Top Button

/** A simple static component to render some text for the landing page. */
class StudentHomePage extends React.Component {
  public render() {
    return (
      <div className="layout-page">
         {/* <StudentPageMenuWidget/> */}
        <Grid stackable={true} verticalAlign="middle" textAlign="center" container={true}>
          <HelpPanelWidget/>

          <Grid.Column width={2}>
            <StudentHomeMenu/>

          </Grid.Column>

          <Grid.Column width={14}>
            <StudentHomeWidget/>
          </Grid.Column>
        </Grid>
        <div>TODO: Back to Top Button</div>
      </div>
    );
  }
}

const StudentHomePageCon = withGlobalSubscription(StudentHomePage);
const StudentHomePageContainer = withInstanceSubscriptions(StudentHomePageCon);

export default StudentHomePageContainer;
