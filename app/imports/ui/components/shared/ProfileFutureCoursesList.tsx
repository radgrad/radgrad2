import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Profile } from '../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../layouts/utilities/route-constants';
import { itemToSlugName } from './utilities/data-model';
import * as Router from './utilities/router';


interface ProfileFutureCoursesListProps {
  profile: Profile;
  size: SemanticSIZES;
}

const ProfileFutureCoursesList: React.FC<ProfileFutureCoursesListProps> = ({ profile, size }) => {
  const match = useRouteMatch();
  // TODO do we want courses in the current academic term?
  const futureCourseInstances = CourseInstances.findNonRetired({ studentID: profile.userID, verified: false });
  const futureCourses = futureCourseInstances.map((ci) => Courses.findDoc(ci.courseID));
  return (
    <Label.Group size={size}>
      {futureCourses.map((course) => {
        const slug = itemToSlugName(course);
        return (
          <Label as={Link} key={course._id}
                 to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${slug}`)}
                 size={size}>
            {course.num}
          </Label>
        );
      })}
    </Label.Group>
  );
};

export default ProfileFutureCoursesList;
