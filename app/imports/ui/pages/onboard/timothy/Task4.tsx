import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { Users } from '../../../../api/user/UserCollection';
import CareerGoalLabel from '../../../components/shared/label/CareerGoalLabel';
import InterestLabel from '../../../components/shared/label/InterestLabel';
import CourseLabel from '../../../components/shared/label/CourseLabel';
import OpportunityLabel from '../../../components/shared/label/OpportunityLabel';
import UserLabel from '../../../components/shared/profile/UserLabel';

interface Task4Prop {
  user: string;
  totalCareerGoals: [];
  totalInterests: [],
  totalCourses: [],
  totalOpportunities: [],
  totalStudents: [],
}

const Task4: React.FC<Task4Prop> = ({ user, totalCareerGoals, totalInterests, totalCourses, totalOpportunities, totalStudents }) => {
  const userID = Users.getProfile(user).userID;
  const careerGoalSlugs = totalCareerGoals.map(careerGoal => CareerGoals.findSlugByID(careerGoal));
  const interestSlugs = totalInterests.map(interest => Interests.findSlugByID(interest));
  const courseSlugs = totalCourses.map(course => Courses.findSlugByID(course));
  const opportunitySlugs = totalOpportunities.map(opportunity => Opportunities.findSlugByID(opportunity));
  return (
    <RadGradSegment header={<RadGradHeader title='TASK 4: LABELS' icon='tags'/>}>
      <h3> Career Goals </h3>
      {careerGoalSlugs.map((slug) => <CareerGoalLabel key={slug} slug={slug} userID={userID} size='small' />)}
      <h3> Courses </h3>
      {courseSlugs.map((slug) => <CourseLabel key={slug} slug={slug} userID={userID} size='small' />)}
      <h3> Interests </h3>
      {interestSlugs.map((slug) => <InterestLabel key={slug} slug={slug} userID={userID} size='small' />)}
      <h3> Opportunities </h3>
      {opportunitySlugs.map((slug) => <OpportunityLabel key={slug} slug={slug} userID={userID} size='small' />)}
      <h3> Students </h3>
      {totalStudents.map((student) => <UserLabel username={student} size='small' />)}
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const user = Meteor.user() ? Meteor.user().username : '';
  const totalCareerGoals = CareerGoals.findNonRetired();
  const totalInterests = Interests.findNonRetired();
  const totalCourses = Courses.findNonRetired();
  const totalOpportunities = Opportunities.findNonRetired();
  const totalStudents = _.map(StudentProfiles.find({}).fetch(), 'username');
  return {
    user,
    totalCareerGoals,
    totalInterests,
    totalCourses,
    totalOpportunities,
    totalStudents,
  };
})(Task4);
