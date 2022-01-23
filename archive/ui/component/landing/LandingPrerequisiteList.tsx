import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Courses } from '../../../../app/imports/api/course/CourseCollection';
import { getSlugFromEntityID } from '../../../../app/imports/ui/components/landing/utilities/helper-functions';
import CourseLabel from '../../../../app/imports/ui/components/shared/label/CourseLabel';

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
