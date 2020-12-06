import React from 'react';
import { List } from 'semantic-ui-react';
import _ from 'lodash';
import { Courses } from '../../../api/course/CourseCollection';
import { getSlugFromEntityID } from './utilities/helper-functions';

interface IPrerequisitesListProps {
  prerequisites: string[];
}

const LandingPrerequisiteList: React.FC<IPrerequisitesListProps> = ({ prerequisites }) => {
  const courses = _.map(prerequisites, (slug) => Courses.findDocBySlug(slug));
  return (
    <List horizontal bulleted>
      {// console.log(course.name);
       courses.map((course) => (<List.Item key={course._id} href={`#/explorer/courses/${getSlugFromEntityID(course._id)}`}>{course.name}</List.Item>))
}
    </List>
  );
};

export default LandingPrerequisiteList;
