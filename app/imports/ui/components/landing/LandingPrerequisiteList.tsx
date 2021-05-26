import React from 'react';
import { Courses } from '../../../api/course/CourseCollection';
import { getSlugFromEntityID } from './utilities/helper-functions';
import CourseLabel from '../shared/label/CourseLabel';

interface PrerequisitesListProps {
  prerequisites: string[];
}

const LandingPrerequisiteList: React.FC<PrerequisitesListProps> = ({ prerequisites }) => {
  const courses = prerequisites.map((slug) => Courses.findDocBySlug(slug));
  return (
  <React.Fragment>
    {courses.map((course) =>
    <CourseLabel key={course._id} slug={getSlugFromEntityID(course._id)} size='small'/>)}
  </React.Fragment>
  );
};

export default LandingPrerequisiteList;
