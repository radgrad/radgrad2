import * as React from 'react';
import { Button, Container, Header, Icon } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { NavLink, withRouter } from 'react-router-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
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
import { getInspectorDraggablePillStyle } from '../shared/StyleFunctions';
import NamePill from '../shared/NamePill';
import { selectCourse } from '../../../redux/actions/actions';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';

interface IInspectorCourseViewProps {
  courseID: string;
  studentID: string;
  courseInstanceID?: string;
  selectCourse: (courseID: string) => any;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectCourse: (courseID) => dispatch(selectCourse(courseID)),
  };
};

class InspectorCourseView extends React.Component<IInspectorCourseViewProps> {
  constructor(props) {
    super(props);
    this.handleRemove = this.handleRemove.bind(this);
  }

  private handleRemove(event, { value }) {
    event.preventDefault();
    // console.log(`Remove CI ${value}`);
    const ci = CourseInstances.findDoc(value);
    const collectionName = CourseInstances.getCollectionName();
    const instance = value;
    const inst = this; // tslint:disable-line: no-this-assignment
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        console.log(`Remove courseInstance ${instance} failed.`, error);
      } else {
        inst.props.selectCourse(ci.courseID);
      }
    });
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
        {plannedCourse ?
          <Button floated="right" basic={true} color="green" value={courseInstance._id} onClick={this.handleRemove}
                  size="tiny">remove</Button> : (pastCourse ?
            <Button floated="right" basic={true} color="green"
                    size="tiny">taken</Button> :
            <Droppable droppableId={'inspector-course'}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                >
                  <Draggable key={courseSlug} draggableId={courseSlug} index={0}>
                    {(prov, snap) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        style={getInspectorDraggablePillStyle(
                          snap.isDragging,
                          prov.draggableProps.style,
                        )}
                      >
                        <NamePill name={courseName}/>
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

const InspectorCourseViewContainer = connect(null, mapDispatchToProps)(InspectorCourseView);
export default withRouter(InspectorCourseViewContainer);
