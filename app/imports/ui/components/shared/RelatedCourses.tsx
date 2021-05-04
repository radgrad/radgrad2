import React from 'react';
import { Course } from '../../../typings/radgrad';
import CourseList from './CourseList';
import RadGradHeader from './RadGradHeader';
import RadGradSegment from './RadGradSegment';

interface RelatedCoursesProps {
  courses: Course[];
  userID: string;
}

const RelatedCourses: React.FC<RelatedCoursesProps> = ({ courses, userID }) => {
  const header = <RadGradHeader title='related courses' icon='book' />;
  return (
    <RadGradSegment header={header}>
      <CourseList courses={courses} keyStr='related-courses' size='medium' userID={userID} />
    </RadGradSegment>
  );
};

export default RelatedCourses;
