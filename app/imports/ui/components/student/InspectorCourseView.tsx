import * as React from 'react';
import { Button, Container, Dropdown, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as Markdown from 'react-markdown';
import { Courses } from '../../../api/course/CourseCollection';
import { buildSimpleName } from '../../../api/degree-plan/PlanChoiceUtilities';
import { Slugs } from '../../../api/slug/SlugCollection';
import IceHeader from '../shared/IceHeader';
import { makeCourseICE } from '../../../api/ice/IceProcessor';
import CoursePrerequisitesView from './CoursePrerequisitesView';
import FutureCourseEnrollmentWidget from '../shared/FutureCourseEnrollmentWidget';
import UserInterestList from '../shared/UserInterestList';

interface IInspectorCourseViewProps {
  courseID: string;
  studentID: string;
}

class InspectorCourseView extends React.Component<IInspectorCourseViewProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const course = Courses.findDoc(this.props.courseID);
    const courseSlug = Slugs.getNameFromID(course.slugID);
    const paddingStyle = {
      paddingTop: 15,
    };
    console.log(course);
    return (
      <Container fluid={true} style={paddingStyle}>
        <Header as="h4" dividing={true}>{course.num} {course.name} <IceHeader ice={makeCourseICE(courseSlug, 'C')}/></Header>
          <Button floated="right" basic={true} color="green"
                  size="tiny">{buildSimpleName(courseSlug)}</Button>
        <b>Scheduled: N/A</b>
        <p><b>Prerequisites:</b>
          <CoursePrerequisitesView prerequisites={course.prerequisites} studentID={this.props.studentID}/>
        </p>
        <p><b>Catelog Description</b> <Markdown escapeHtml={true} source={course.description} /> </p>
        <p/><FutureCourseEnrollmentWidget courseID={course._id}/>
        <p><b>Interests:</b></p>
        <UserInterestList userID={this.props.studentID} interestIDs={course.interestIDs}/>
      </Container>
    );
  }
}

export default InspectorCourseView;
