import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Course } from '../../../typings/radgrad';
import CourseLabel from './label/CourseLabel';
import { itemToSlugName } from './utilities/data-model';

interface CourseListProps {
  courses: Course[];
  keyStr: string;
  size: SemanticSIZES;
  userID: string;
}

const CourseList: React.FC<CourseListProps> = ({ courses, size, keyStr, userID }) => (
  <Label.Group size={size}>
    {courses.map((course) => {
      const slug = itemToSlugName(course);
      return (
        <CourseLabel key={slug} slug={slug} userID={userID} size={size} />
      );
    },
    )}
  </Label.Group>
);

export default CourseList;
