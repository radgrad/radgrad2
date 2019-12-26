import React from 'react';
import { Button, Container, Header, Icon } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
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
import { degreePlannerActions } from '../../../redux/student/degree-planner';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { IRadGradMatch } from '../../../typings/radgrad';

interface IInspectorCourseViewProps {
  courseID: string;
  studentID: string;
  courseInstanceID?: string;
  selectCourse: (courseID: string) => any;
  match: IRadGradMatch;
}

const mapDispatchToProps = (dispatch) => ({
  selectCourse: (courseID) => dispatch(degreePlannerActions.selectCourse(courseID)),
});

const handleRemove = (props: IInspectorCourseViewProps) => (event, { value }) => {
  event.preventDefault();
  // console.log(`Remove CI ${value}`);
  const ci = CourseInstances.findDoc(value);
  const collectionName = CourseInstances.getCollectionName();
  const instance = value;
  removeItMethod.call({ collectionName, instance }, (error) => {
    if (error) {
      console.error(`Remove courseInstance ${instance} failed.`, error);
    } else {
      props.selectCourse(ci.courseID);
    }
  });
};

const InspectorCourseView = (props: IInspectorCourseViewProps) => {
  const course = Courses.findDoc(props.courseID);
  const courseSlug = Slugs.getNameFromID(course.slugID);
  const courseName = buildSimpleName(courseSlug);
  let courseInstance;
  let grade = 'C';
  let plannedCourse = false;
  let pastCourse = false;
  if (props.courseInstanceID) {
    courseInstance = CourseInstances.findDoc(props.courseInstanceID);
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
  const username = props.match.params.username;
  const baseUrl = props.match.url;
  const baseIndex = baseUrl.indexOf(username);
  const baseRoute = `/#${baseUrl.substring(0, baseIndex)}${username}/explorer/courses/${courseSlug}`;
  // console.log(course);
  return (
    <Container fluid style={paddingStyle}>
      <Header as="h4" dividing>
        {course.num}
        {' '}
        {course.name}
        {' '}
        <IceHeader
          ice={makeCourseICE(courseSlug, grade)}
        />
      </Header>
      {plannedCourse ? (
        <Button
          floated="right"
          basic
          color="green"
          value={courseInstance._id}
          onClick={handleRemove(props)}
          size="tiny"
        >
remove
        </Button>
      ) : (pastCourse ? (
        <Button
          floated="right"
          basic
          color="green"
          size="tiny"
        >
taken
        </Button>
        ) : (
          <Droppable droppableId="inspector-course">
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
                      <NamePill name={courseName} />
                    </div>
                  )}
                </Draggable>
              </div>
)}
          </Droppable>
        ))}

      <b>
Scheduled:
        {courseInstance ? AcademicTerms.toString(courseInstance.termID) : 'N/A'}
      </b>
      <p><b>Prerequisites:</b></p>
      <CoursePrerequisitesView prerequisites={course.prerequisites} studentID={props.studentID} />
      <p><b>Catalog Description:</b></p>
      <Markdown escapeHtml source={course.description} />
      <p />
      <FutureCourseEnrollmentWidget courseID={course._id} />
      <p><b>Interests:</b></p>
      <UserInterestList userID={props.studentID} interestIDs={course.interestIDs} />
      <p />
      <a href={baseRoute}>
View in Explorer
        <Icon name="arrow right" />
      </a>
      <p />
    </Container>
  );
};

const InspectorCourseViewContainer = connect(null, mapDispatchToProps)(InspectorCourseView);
export default withRouter(InspectorCourseViewContainer);
