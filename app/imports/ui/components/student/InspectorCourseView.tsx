import * as React from 'react';
import { Button, Dropdown, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection';
import { buildSimpleName } from '../../../api/degree-plan/PlanChoiceUtilities';
import { Slugs } from '../../../api/slug/SlugCollection';
import IceHeader from '../shared/IceHeader';
import { makeCourseICE } from '../../../api/ice/IceProcessor';

interface IInspectorCourseViewProps {
  courseID: string;
}

class InspectorCourseView extends React.Component<IInspectorCourseViewProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const course = Courses.findDoc(this.props.courseID);
    const courseSlug = Slugs.getNameFromID(course.slugID);
    console.log(course.prerequisites);
    return (
      <div>
        <Header as="h4" dividing={true}>{course.num} {course.name} <IceHeader ice={makeCourseICE(courseSlug, 'C')}/></Header>
          <Button floated="right" basic={true} color="green"
                  size="tiny">{buildSimpleName(courseSlug)}</Button>
        <b>Scheduled: N/A</b>
        <p><b>Prerequisites:</b>
        </p>
      </div>
    );
  }
}

export default InspectorCourseView;
