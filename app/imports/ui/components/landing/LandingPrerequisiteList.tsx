import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Courses } from '../../../api/course/CourseCollection';
import { getSlugFromEntityID } from './utilities/helper-functions';
import CourseLabel from '../shared/label/CourseLabel';

interface LandingPrerequisitesListProps {
  prerequisites: string[];
  size: SemanticSIZES;
}

const LandingPrerequisiteList: React.FC<LandingPrerequisitesListProps> = ({ size, prerequisites }) => {
  const courses = prerequisites.map((slug) => Courses.findDocBySlug(slug));
  return (
    <Label.Group size={size}>
      {courses.map((course) =>
        <CourseLabel key={course._id} slug={getSlugFromEntityID(course._id)} size={size} />)}
    </Label.Group>
  );
};

export default LandingPrerequisiteList;
