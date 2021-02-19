import React from 'react';
import { SemanticSIZES } from 'semantic-ui-react';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Profile } from '../../../typings/radgrad';
import CourseList from './CourseList';


interface ProfileFutureCoursesListProps {
  profile: Profile;
  size: SemanticSIZES;
}

const ProfileFutureCoursesList: React.FC<ProfileFutureCoursesListProps> = ({ profile, size }) => {
  // TODO do we want courses in the current academic term?
  const futureCourseInstances = CourseInstances.findNonRetired({ studentID: profile.userID, verified: false });
  const futureCourses = futureCourseInstances.map((ci) => Courses.findDoc(ci.courseID));
  return (
    <CourseList courses={futureCourses} size={size} />
  );
};

export default ProfileFutureCoursesList;
