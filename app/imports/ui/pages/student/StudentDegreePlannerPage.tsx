import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { DragDropContext } from 'react-beautiful-dnd';
import { withRouter } from 'react-router-dom';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import TabbedPlanInspector from '../../components/student/TabbedPlanInspector';
import DegreeExperiencePlannerWidget from '../../components/student/DegreeExperiencePlannerWidget';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { ICourseInstanceDefine } from '../../../typings/radgrad';

interface IPageProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}
/** A simple static component to render some text for the landing page. */
class StudentDegreePlannerPage extends React.Component<IPageProps> {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  public onDragEnd(result) {
    console.log(result);
    const termSlug = result.destination.droppableId;
    const courseSlug = result.draggableId;
    const student = this.props.match.params.username;
    if (Courses.isDefined(courseSlug)) {
      const courseID = Courses.findIdBySlug(courseSlug);
      const course = Courses.findDoc(courseID);
      const collectionName = CourseInstances.getCollectionName();
      const definitionData: ICourseInstanceDefine = {
        academicTerm: termSlug,
        course: courseSlug,
        verified: false,
        fromSTAR: false,
        note: course.num,
        grade: 'B',
        student,
        creditHrs: course.creditHrs,
      };
      defineMethod.call({ collectionName, definitionData }, (error, result) => {
        if (error) {
          console.log(error);
        }
        console.log(result);
      });
    }
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
            </Grid.Column>

            <Grid.Column width={6} style={paddedStyle}>
              <TabbedPlanInspector/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </DragDropContext>
    );
  }
}

const StudentDegreePlannerPageCon = withGlobalSubscription(StudentDegreePlannerPage);
const StudentDegreePlannerPageContainer = withInstanceSubscriptions(StudentDegreePlannerPageCon);

export default withRouter(StudentDegreePlannerPageContainer);
