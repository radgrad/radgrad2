import React from 'react';
import { Card, Icon, Message } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { Course, CourseInstance } from '../../../../typings/radgrad';
import * as Router from '../../shared/utilities/router';
import ProfileCourseCard from './ProfileCourseCard';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';

interface ProfileCoursesProps {
  studentID: string;
  courses: Course[];
  courseInstances: CourseInstance[];
}

const ProfileCourses: React.FC<ProfileCoursesProps> = ({ studentID, courses, courseInstances }) => {
  const match = useRouteMatch();
  const hasProfileEntries = courses.length > 0;
  return (
    <div>
      {hasProfileEntries ? (
        <Card.Group itemsPerRow={1}>
          {_.map(courses, (c) => (
            <ProfileCourseCard key={c._id} course={c} studentID={studentID} courseInstances={courseInstances} />
          ))}
        </Card.Group>
      ) : (
        <Message>
          <Message.Header>No Profile Courses</Message.Header>
          <p>You can add courses to your profile in the explorer.</p>
          <Link to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}`)}>
            View in Explorer <Icon name="arrow right" />
          </Link>
        </Message>
      )}
    </div>
  );
};

export default ProfileCourses;
