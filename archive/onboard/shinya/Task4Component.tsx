import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import RadGradHeader from '../../../app/imports/ui/components/shared/RadGradHeader';
import RadGradSegment from '../../../app/imports/ui/components/shared/RadGradSegment';
import CareerGoalLabel from '../../../app/imports/ui/components/shared/label/CareerGoalLabel';
import CourseLabel from '../../../app/imports/ui/components/shared/label/CourseLabel';
import { CareerGoal, Course, Interest, Opportunity, StudentProfile } from '../../../app/imports/typings/radgrad';
import { CareerGoals } from '../../../app/imports/api/career/CareerGoalCollection';
import { Courses } from '../../../app/imports/api/course/CourseCollection';
import InterestLabel from '../../../app/imports/ui/components/shared/label/InterestLabel';
import { Interests } from '../../../app/imports/api/interest/InterestCollection';
import OpportunityLabel from '../../../app/imports/ui/components/shared/label/OpportunityLabel';
import { Opportunities } from '../../../app/imports/api/opportunity/OpportunityCollection';
import UserLabel from '../../../app/imports/ui/components/shared/profile/UserLabel';
import { StudentProfiles } from '../../../app/imports/api/user/StudentProfileCollection';

export interface Task4Props {
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
  students: StudentProfile[];
}
const Task4Component: React.FC<Task4Props> = ({ students, careerGoals, courses, interests, opportunities }) => {
  const Task4Header = <RadGradHeader title="Task 4 Labels" icon="tags"/>;
  const loggedInUser = Meteor.user() ? Meteor.user()._id : '';
  return (
    <RadGradSegment header={Task4Header}>
      <RadGradHeader title="Career Goals"/>
      {careerGoals.map((careerGoal) => <CareerGoalLabel key={careerGoal._id} slug={careerGoal.slugID} userID={ loggedInUser } size='small'/>)}
      <RadGradHeader title="Courses"/>
      {courses.map((course)=><CourseLabel key={course._id} slug={course.slugID} userID={ loggedInUser} size='small'/>)}
      <RadGradHeader title="Interests"/>
      {interests.map((interest) => <InterestLabel key={interest._id} slug={interest.slugID} userID={loggedInUser} size='small'/>)}
      <RadGradHeader title="Opportunities"/>
      {opportunities.map((opportunity) => <OpportunityLabel key={opportunity._id} slug={opportunity.slugID} userID = {loggedInUser} size='small'/>)}
      <RadGradHeader title="Students"/>
      {students.map((student) => <UserLabel key={student._id} username={student.username} size='small'/>)}
    </RadGradSegment>
  );
};
export default withTracker(() => {
  const careerGoals = CareerGoals.findNonRetired();
  const courses = Courses.findNonRetired();
  const interests = Interests.findNonRetired();
  const opportunities = Opportunities.findNonRetired();
  const students = StudentProfiles.find({ isAlumni: false }, {}).fetch();
  return {
    careerGoals,
    courses,
    interests,
    opportunities,
    students,
  };
})(Task4Component);
