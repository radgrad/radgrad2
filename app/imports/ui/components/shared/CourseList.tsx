import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Course } from '../../../typings/radgrad';
import CourseLabel from './label/CourseLabel';
import { itemToSlugName } from './utilities/data-model';

interface CourseListProps {
  courses: Course[];
  keyStr: string;
  size: SemanticSIZES;
}

const CourseList: React.FC<CourseListProps> = ({ courses, size, keyStr }) => (
  <Label.Group size={size}>
    {courses.map((course) => {
      const slug = itemToSlugName(course);
      return (
        <CourseLabel slug={slug} />
      );
    })}
  </Label.Group>
);

export default CourseList;
