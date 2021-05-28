import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import CourseLabel from '../shared/label/CourseLabel';
import { Course } from '../../../typings/radgrad';
import { getSlugFromEntityID } from './utilities/helper-functions';

interface LandingCoursesListProps {
  courses: Course[];
  size: SemanticSIZES;
}

const LandingCourseList: React.FC<LandingCoursesListProps> = ({ size, courses }) => (
  <Label.Group size={size}>
    {courses.map((course) =>
      <CourseLabel key={course._id} slug={getSlugFromEntityID(course._id)} size={size} />)}
  </Label.Group>
);

export default LandingCourseList;
