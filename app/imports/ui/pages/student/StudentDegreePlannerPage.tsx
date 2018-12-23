import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { DragDropContext } from 'react-beautiful-dnd';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import TabbedPlanInspector from '../../components/student/TabbedPlanInspector';
import ConnectedCourseSelectorTempContainer from '../../components/student/CourseSelectorTemp';
import ConnectedCourseInstanceSelectorTempContainer from '../../components/student/CourseInstanceSelectorTemp';
import BeautifulExample from '../../components/student/BeautifulExample';
import DegreeExperiencePlannerWidget from '../../components/student/DegreeExperiencePlannerWidget';

/** A simple static component to render some text for the landing page. */
class StudentDegreePlannerPage extends React.Component {

  public onDragEnd(result) {
    console.log(result);
  }
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
      <DragDropContext onDragEnd={this.onDragEnd}>
        <StudentPageMenuWidget/>
        <Grid stackable={true} style={paddedStyle}>
          <Grid.Row stretched={true}>
            <Grid.Column width={10} style={marginRightStyle}>
              <h1>Student DegreePlanner</h1>
              <DegreeExperiencePlannerWidget/>
              <BeautifulExample/>
            </Grid.Column>

            <Grid.Column width={6} style={paddedStyle}>
              <TabbedPlanInspector/>
              <ConnectedCourseInstanceSelectorTempContainer />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </DragDropContext>
    );
  }
}

const StudentDegreePlannerPageCon = withGlobalSubscription(StudentDegreePlannerPage);
const StudentDegreePlannerPageContainer = withInstanceSubscriptions(StudentDegreePlannerPageCon);

export default StudentDegreePlannerPageContainer;
