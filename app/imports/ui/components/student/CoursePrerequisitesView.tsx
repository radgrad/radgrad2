import * as React from 'react';
import { List, Icon } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { PlanChoiceCollection } from '../../../api/degree-plan/PlanChoiceCollection';
import { satisfiesPlanChoice } from '../../../api/degree-plan/PlanChoiceUtilities';

interface ICoursePrerequisitesViewProps {
  prerequisites: string[];
  studentID: string;
}

function missingPrerequisite(prereqSlug, studentID) {
  const courseInstances = CourseInstances.find({ studentID }).fetch();
  let ret = true;
  _.forEach(courseInstances, (ci) => {
    const courseSlug = CourseInstances.getCourseSlug(ci._id);
    // console.log(prereqSlug, courseSlug, satisfiesPlanChoice(prereqSlug, courseSlug))
    if (satisfiesPlanChoice(prereqSlug, courseSlug)) {
      ret = false;
    }
  });
  return ret;
}

class CoursePrerequisitesView extends React.Component<ICoursePrerequisitesViewProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    // console.log(this.props);
    return (
      <List bulleted={true}>
        {_.map(this.props.prerequisites, (p) => (
              <List.Item key={p}>
                {PlanChoiceCollection.toStringFromSlug(p)}
                {missingPrerequisite(p, this.props.studentID) ? <Icon name="warning" color="red"/> :
                  <Icon name="checkmark" color="green"/>}
              </List.Item>
          ))}
      </List>
    );
  }

}

export default CoursePrerequisitesView;
