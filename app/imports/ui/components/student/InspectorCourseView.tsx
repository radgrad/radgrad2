import * as React from 'react';
import { Button, Container, Dropdown, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { NavLink, withRouter } from 'react-router-dom';
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
    const paddingStyle = {
      paddingTop: 15,
      paddingBottom: 15,
    };
    const alignRightStyle = {
      textAlign: 'right',
    };
    const username = this.props.match.params.username;
    const baseUrl = this.props.match.url;
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `/#${baseUrl.substring(0, baseIndex)}${username}/explorer/courses/${courseSlug}`;
    // console.log(course);
    return (
      <Container fluid={true} style={paddingStyle}>
        <Header as="h4" dividing={true}>{course.num} {course.name} <IceHeader
          ice={makeCourseICE(courseSlug, 'C')}/></Header>
        <Button floated="right" basic={true} color="green"
                size="tiny">{buildSimpleName(courseSlug)}</Button>
        <b>Scheduled: N/A</b>
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
