import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import CareerGoalLabel from '../../../components/shared/label/CareerGoalLabel';
import InterestLabel from '../../../components/shared/label/InterestLabel';
import CourseLabel from '../../../components/shared/label/CourseLabel';
import OpportunityLabel from '../../../components/shared/label/OpportunityLabel';
import { CareerGoal, Course, Interest, Opportunity, StudentProfile } from '../../../../typings/radgrad';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import UserLabel from '../../../components/shared/profile/UserLabel';

interface LabelProps {
  careerGoals: CareerGoal[];
  interests: Interest[];
  courses: Course[];
  opportunities: Opportunity[];
  students: StudentProfile[];
}

const Task4Segment: React.FC<LabelProps> = ({ careerGoals, interests, courses, opportunities, students }) => {
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  return (
    <RadGradSegment header={<RadGradHeader dividing title='Task 4: Labels' icon='tags' />}>
      <h3> Career Goals </h3>
      {careerGoals.map((career) => <CareerGoalLabel key={career._id} slug={career.slugID} userID={currentUser} size='small'/>)}

      <h3> Courses </h3>
      {courses.map((course) => <CourseLabel key={course._id} slug={course.slugID} userID={currentUser} size='small'/>)}

      <h3> Interests </h3>
      {interests.map((interest) => <InterestLabel key={interest._id} slug={interest.slugID} userID={currentUser} size='small'/>)}

      <h3> Opportunities </h3>
      {opportunities.map((opportunity) => <OpportunityLabel key={opportunity._id} slug={opportunity.slugID} userID={currentUser} size='small'/>)}

      <h3> Students </h3>
      {students.map((student) => <UserLabel key={student._id} username={student.username} size='small'/>)}
      
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const careerGoals = CareerGoals.findNonRetired();
  const interests = Interests.findNonRetired();
  const courses = Courses.findNonRetired();
  const opportunities = Opportunities.findNonRetired();
  const students = StudentProfiles.find({ isAlumni: false }).fetch();
  return {
    careerGoals,
    interests,
    courses,
    opportunities,
    students,
  };
})(Task4Segment);

