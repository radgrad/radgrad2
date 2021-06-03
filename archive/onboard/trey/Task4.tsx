import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { CareerGoals } from '../../../app/imports/api/career/CareerGoalCollection';
import { Courses } from '../../../app/imports/api/course/CourseCollection';
import { Interests } from '../../../app/imports/api/interest/InterestCollection';
import { Opportunities } from '../../../app/imports/api/opportunity/OpportunityCollection';
import { StudentProfiles } from '../../../app/imports/api/user/StudentProfileCollection';
import { CareerGoal, Course, Interest, Opportunity, StudentProfile } from '../../../app/imports/typings/radgrad';
import RadGradHeader from '../../../app/imports/ui/components/shared/RadGradHeader';
import RadGradSegment from '../../../app/imports/ui/components/shared/RadGradSegment';
import CareerGoalLabel from '../../../app/imports/ui/components/shared/label/CareerGoalLabel';
import InterestLabel from '../../../app/imports/ui/components/shared/label/InterestLabel';
import CourseLabel from '../../../app/imports/ui/components/shared/label/CourseLabel';
import OpportunityLabel from '../../../app/imports/ui/components/shared/label/OpportunityLabel';
import UserLabel from '../../../app/imports/ui/components/shared/profile/UserLabel';

interface Task4Props {
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
  students: StudentProfile[];
}

const Task4: React.FC<Task4Props> = ({ careerGoals, courses, interests, opportunities, students }) => {

  const currentUser = Meteor.user() ? Meteor.user()._id : '';

  return (
    <RadGradSegment header={<RadGradHeader title='TASK 4: LABELS' icon='tags' dividing />}>

      <h3>Career Goals</h3>
      {careerGoals.map((careerGoal) => <CareerGoalLabel key={careerGoal._id} slug={careerGoal.slugID} userID={currentUser} size='small' />)}

      <h3>Courses</h3>
      {courses.map((course) => <CourseLabel key={course._id} slug={course.slugID} userID={currentUser} size='small' />)}

      <h3>Interests</h3>
      {interests.map((interest) => <InterestLabel key={interest._id} slug={interest.slugID} userID={currentUser} size='small' />)}

      <h3>Opportunities</h3>
      {opportunities.map((opportunity) => <OpportunityLabel key={opportunity._id} slug={opportunity.slugID} userID={currentUser} size='small' />)}

      <h3>Students</h3>
      {students.map((student) => <UserLabel key={student._id} username={student.username} size='small' />)}

    </RadGradSegment>
  );
};

export default withTracker(() => {
  const careerGoals = CareerGoals.findNonRetired();
  const courses = Courses.findNonRetired();
  const interests = Interests.findNonRetired();
  const opportunities = Opportunities.findNonRetired();
  const students = StudentProfiles.findNonRetired({ isAlumni: false });
  return {
    careerGoals,
    courses,
    interests,
    opportunities,
    students,
  };
})(Task4);