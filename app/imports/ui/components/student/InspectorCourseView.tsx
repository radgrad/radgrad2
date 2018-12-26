import * as React from 'react';
import { Button, Label, Container, Header, Icon } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { NavLink, withRouter } from 'react-router-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Courses } from '../../../api/course/CourseCollection';
import { buildSimpleName } from '../../../api/degree-plan/PlanChoiceUtilities';
import { Slugs } from '../../../api/slug/SlugCollection';
import IceHeader from '../shared/IceHeader';
import { makeCourseICE } from '../../../api/ice/IceProcessor';
import CoursePrerequisitesView from './CoursePrerequisitesView';
import FutureCourseEnrollmentWidget from '../shared/FutureCourseEnrollmentWidget';
import UserInterestList from '../shared/UserInterestList';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { getInspectorViewItemStyle } from './StyleFunctions';

interface IInspectorCourseViewProps {
  courseID: string;
  studentID: string;
  courseInstanceID?: string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class InspectorCourseView extends React.Component<IInspectorCourseViewProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const course = Courses.findDoc(this.props.courseID);
    const courseSlug = Slugs.getNameFromID(course.slugID);
    const courseName = buildSimpleName(courseSlug);
    let courseInstance;
    let grade = 'C';
    let plannedCourse = false;
    let pastCourse = false;
    if (this.props.courseInstanceID) {
      courseInstance = CourseInstances.findDoc(this.props.courseInstanceID);
      grade = courseInstance.grade;
      const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
      const courseTerm = AcademicTerms.findDoc(courseInstance.termID);
      plannedCourse = currentTerm.termNumber <= courseTerm.termNumber;
      pastCourse = currentTerm.termNumber > courseTerm.termNumber;
    }
    const paddingStyle = {
      paddingTop: 15,
      paddingBottom: 15,
    };
    const username = this.props.match.params.username;
    const baseUrl = this.props.match.url;
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `/#${baseUrl.substring(0, baseIndex)}${username}/explorer/courses/${courseSlug}`;
    // console.log(course);
    return (
      <Container fluid={true} style={paddingStyle}>
        <Header as="h4" dividing={true}>{course.num} {course.name} <IceHeader
          ice={makeCourseICE(courseSlug, grade)}/></Header>
        {plannedCourse ? <Button floated="right" basic={true} color="green"
                                 size="tiny">remove</Button> : (pastCourse ?
          <Button floated="right" basic={true} color="green"
                  size="tiny">taken</Button> : <Droppable droppableId={`inspector-course`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
              >
                <Draggable key={courseSlug} draggableId={courseSlug} index={0}>
                  {(prov, snap) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      style={getInspectorViewItemStyle(
                        snap.isDragging,
                        prov.draggableProps.style,
                      )}
                    >
                      <b>{courseName}</b>
                    </div>
                  )}
                </Draggable>
              </div>)}
          </Droppable>)}

        <b>Scheduled: {courseInstance ? AcademicTerms.toString(courseInstance.termID) : 'N/A'}</b>
        <p><b>Prerequisites:</b></p>
        <CoursePrerequisitesView prerequisites={course.prerequisites} studentID={this.props.studentID}/>
        <p><b>Catalog Description:</b></p>
        <Markdown escapeHtml={true} source={course.description}/>
        <p/>
        <FutureCourseEnrollmentWidget courseID={course._id}/>
        <p><b>Interests:</b></p>
        <UserInterestList userID={this.props.studentID} interestIDs={course.interestIDs}/>
        <p/>
        <a href={baseRoute}>View in Explorer <Icon name="arrow right"/></a>
        <p/>
      </Container>
    );
  }
}

export default withRouter(InspectorCourseView);
