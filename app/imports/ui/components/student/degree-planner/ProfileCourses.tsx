import React from 'react';
import { Message } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { Course, CourseInstance } from '../../../../typings/radgrad';
import { ButtonLink } from '../../shared/button/ButtonLink';
import * as Router from '../../shared/utilities/router';
import ProfileCourseAccordion from './ProfileCourseAccordion';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';

interface ProfileCoursesProps {
  studentID: string;
  courses: Course[];
  courseInstances: CourseInstance[];
}

const ProfileCourses: React.FC<ProfileCoursesProps> = ({ studentID, courses, courseInstances }) => {
  const match = useRouteMatch();
  const hasProfileEntries = courses?.length > 0;
  return (
    <div>
      {hasProfileEntries ? (
        courses.map((c) => <ProfileCourseAccordion key={c._id} course={c} studentID={studentID} courseInstances={courseInstances} />)
      ) : (
        <Message>
          <Message.Header>No Profile Courses</Message.Header>
          <p>You can add courses to your profile in the explorer.</p>
          <ButtonLink url={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}`)} label="View in Explorer" rel="noopener noreferrer" size="medium" />
        </Message>
      )}
    </div>
  );
};

export default ProfileCourses;
