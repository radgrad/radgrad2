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

const missingPrerequisite = (prereqSlug, studentID) => {
  const courseInstances = CourseInstances.find({ studentID }).fetch();
  let ret = true;
  _.forEach(courseInstances, (ci) => {
    const courseSlug = CourseInstances.getCourseSlug(ci._id);
    // console.log(prereqSlug, getCourseSlug, satisfiesPlanChoice(prereqSlug, getCourseSlug))
    if (satisfiesPlanChoice(prereqSlug, courseSlug)) {
      ret = false;
    }
  });
  return ret;
};

const CoursePrerequisitesView = (props: ICoursePrerequisitesViewProps) => {
  // console.log(props);
  return (
    <List bulleted={true}>
      {_.map(props.prerequisites, (p) => (
        <List.Item key={p}>
          {PlanChoiceCollection.toStringFromSlug(p)}
          {missingPrerequisite(p, props.studentID) ? <Icon name="warning" color="red"/> :
            <Icon name="checkmark" color="green"/>}
        </List.Item>
      ))}
    </List>
  );
};

export default CoursePrerequisitesView;
