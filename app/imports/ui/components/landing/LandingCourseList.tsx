import React from 'react';
import CourseLabel from '../shared/label/CourseLabel';
import { Course } from '../../../typings/radgrad';
import { getSlugFromEntityID } from './utilities/helper-functions';

interface WithCoursesProps {
  courses : Course[];
}

const LandingCourseList: React.FC<WithCoursesProps> = ({ courses }) => (
<React.Fragment>
  {courses.map((course) =>
  <CourseLabel key={course._id} slug={getSlugFromEntityID(course._id)} size='small'/>)}
</React.Fragment>
);

export default LandingCourseList;
