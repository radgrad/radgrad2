import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import TabbedPlanInspector from '../../components/student/TabbedPlanInspector';
import ConnectedCourseSelectorTempContainer from '../../components/student/CourseSelectorTemp';

/** A simple static component to render some text for the landing page. */
class StudentDegreePlannerPage extends React.Component {
  public render() {
    const paddedStyle = {
      paddingTop: 20,
    };
    return (
      <div>
        <StudentPageMenuWidget/>
        <Grid container={true} stackable={true} style={paddedStyle}>

          <Grid.Column width={10}>
            <h1>Student DegreePlanner</h1>
          </Grid.Column>

          <Grid.Column width={6}>
            Inspector
            <TabbedPlanInspector/>
            <ConnectedCourseSelectorTempContainer/>
          </Grid.Column>

        </Grid>
      </div>
    );
  }
}

const StudentDegreePlannerPageCon = withGlobalSubscription(StudentDegreePlannerPage);
const StudentDegreePlannerPageContainer = withInstanceSubscriptions(StudentDegreePlannerPageCon);

export default StudentDegreePlannerPageContainer;
