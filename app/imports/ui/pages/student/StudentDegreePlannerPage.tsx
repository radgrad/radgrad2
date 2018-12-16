import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import TabbedPlanInspector from '../../components/student/TabbedPlanInspector';
import ConnectedCourseSelectorTempContainer from '../../components/student/CourseSelectorTemp';
import ConnectedCourseInstanceSelectorTempContainer from '../../components/student/CourseInstanceSelectorTemp';

/** A simple static component to render some text for the landing page. */
class StudentDegreePlannerPage extends React.Component {
  public render() {
    const paddedStyle = {
      paddingTop: 20,
      paddingLeft: 10,
      paddingRight: 20,
    };
    const marginRightStyle = {
      marginRight: 0,
    };
    return (
      <div>
        <StudentPageMenuWidget/>
        <Grid stackable={true} style={paddedStyle}>
          <Grid.Row stretched={true}>
            <Grid.Column width={10} style={marginRightStyle}>
              <h1>Student DegreePlanner</h1>
            </Grid.Column>

            <Grid.Column width={6} style={paddedStyle}>
              <TabbedPlanInspector/>
              <ConnectedCourseInstanceSelectorTempContainer />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const StudentDegreePlannerPageCon = withGlobalSubscription(StudentDegreePlannerPage);
const StudentDegreePlannerPageContainer = withInstanceSubscriptions(StudentDegreePlannerPageCon);

export default StudentDegreePlannerPageContainer;
