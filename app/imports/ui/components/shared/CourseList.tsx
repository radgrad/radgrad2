import React from 'react';
import { Icon, Label, SemanticSIZES } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Course } from '../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../layouts/utilities/route-constants';
import { itemToSlugName } from './utilities/data-model';
import * as Router from './utilities/router';

interface CourseListProps {
  courses: Course[];
  keyStr: string;
  size: SemanticSIZES;
}

const CourseList: React.FC<CourseListProps> = ({ courses, size, keyStr }) => {
  const match = useRouteMatch();
  return (
    <Label.Group size={size}>
      {courses.map((course) => {
        const slug = itemToSlugName(course);
        return (
          <Label as={Link} key={`${course._id}-${keyStr}`}
                 to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${slug}`)}
                 size={size}>
            <Icon name="book"/>
            {course.num}
          </Label>
        );
      })}
    </Label.Group>
  );
};

export default CourseList;
