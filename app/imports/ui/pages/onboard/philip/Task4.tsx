import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { useParams } from 'react-router';
import { Header } from 'semantic-ui-react';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { Users } from '../../../../api/user/UserCollection';
import { BaseProfile, CareerGoal, Course, Interest, Opportunity, StudentProfile } from '../../../../typings/radgrad';
import CareerGoalLabel from '../../../components/shared/label/CareerGoalLabel';
import CourseLabel from '../../../components/shared/label/CourseLabel';
import InterestLabel from '../../../components/shared/label/InterestLabel';
import OpportunityLabel from '../../../components/shared/label/OpportunityLabel';
import UserLabel from '../../../components/shared/profile/UserLabel';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';

interface Task4Props {
  careerGoals: CareerGoal[];
  interests: Interest[];
  courses: Course[];
  opportunities: Opportunity[];
  students: StudentProfile[];
}

const Task4: React.FC<Task4Props> = ({ careerGoals, interests, courses, opportunities, students }) => {
  const { username } = useParams();
  const profile = Users.getProfile(username) as BaseProfile;
  const userID = profile.userID;
  const header = <RadGradHeader title="Task 4: Labels" icon='tags' />;
  const careerGoalSlugs = careerGoals.map(careerGoal => CareerGoals.findSlugByID(careerGoal._id));
  const courseSlugs = courses.map(course => Courses.findSlugByID(course._id));
  const interestSlugs = interests.map(course => Interests.findSlugByID(course._id));
  const opportunitySlugs = opportunities.map(course => Opportunities.findSlugByID(course._id));
  const studentUsernames = students.map(student => student.username);
  return (
    <RadGradSegment header={header}>
      <Header>Career Goals</Header>
      {careerGoalSlugs.map(slug => <CareerGoalLabel key={slug} slug={slug} userID={userID}  size='tiny'/>)}
      <Header>Courses</Header>
      {courseSlugs.map(slug => <CourseLabel key={slug} slug={slug} userID={userID}  size='tiny'/>)}
      <Header>Interests</Header>
      {interestSlugs.map(slug => <InterestLabel key={slug} slug={slug} userID={userID}  size='tiny'/>)}
      <Header>Opportunities</Header>
      {opportunitySlugs.map(slug => <OpportunityLabel key={slug} slug={slug} userID={userID}  size='tiny'/>)}
      <Header>Students</Header>
      {studentUsernames.map(user => <UserLabel key={user} username={user} size='tiny'/>)}
    </RadGradSegment>
  );
};

const Task4Container = withTracker(() => {
  const careerGoals = CareerGoals.findNonRetired();
  const interests = Interests.findNonRetired();
  const courses = Courses.findNonRetired();
  const opportunities = Opportunities.findNonRetired();
  const students = StudentProfiles.findNonRetired();
  return { careerGoals, interests, courses, opportunities, students };
})(Task4);

export default Task4Container;
