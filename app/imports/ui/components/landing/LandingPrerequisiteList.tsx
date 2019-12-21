import * as React from 'react';
import { List } from 'semantic-ui-react';
import * as _ from 'lodash';
import { Courses } from '../../../api/course/CourseCollection';
import { getSlugFromEntityID } from './helper-functions';

interface IPrerequisitesListProps {
  prerequisites: string[];
}

const LandingPrerequisiteList = (props: IPrerequisitesListProps) => {
  const courses = _.map(props.prerequisites, (slug) => Courses.findDocBySlug(slug));
  return (
    <List horizontal bulleted>
      {// console.log(course.name);
       courses.map((course) => (<List.Item key={course._id} href={`#/explorer/courses/${getSlugFromEntityID(course._id)}`}>{course.name}</List.Item>))
}
    </List>
  );
};

export default LandingPrerequisiteList;
