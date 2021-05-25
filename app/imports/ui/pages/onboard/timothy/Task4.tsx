import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { Label } from 'semantic-ui-react';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { Users } from '../../../../api/user/UserCollection';
import { itemToSlugName } from '../../../components/shared/utilities/data-model';
import CareerGoalLabel from '../../../components/shared/label/CareerGoalLabel';
import InterestLabel from '../../../components/shared/label/InterestLabel';
import CourseLabel from '../../../components/shared/label/CourseLabel';
import OpportunityLabel from '../../../components/shared/label/OpportunityLabel';
import UserLabel from '../../../components/shared/profile/UserLabel';

interface OnBoardVar {
  user: string;
  totalCareerGoals: [];
  totalInterests: [],
  totalCourses: [],
  totalOpportunities: [],
  totalStudents: [],
}

const Task4: React.FC<OnBoardVar> = ({ user, totalCareerGoals, totalInterests, totalCourses, totalOpportunities, totalStudents }) => {
  const entitiesList = (entity) => {
    const profile = Users.getProfile(user);
    switch (entity) {
      case totalCareerGoals:
        return (
        <Label.Group size="medium">
          {totalCareerGoals.map((careerGoal) => {
            const slug = itemToSlugName(careerGoal);
            return (
            <CareerGoalLabel key={slug} size="medium" slug={slug} userID={profile.userID} />
            );
          })}
        </Label.Group>
        );
      case totalInterests:
        return (
        <Label.Group size="medium">
          {totalInterests.map((interest) => {
            const slug = itemToSlugName(interest);
            return (
            <InterestLabel key={slug} size="medium" slug={slug} userID={profile.userID} />
            );
          })}
        </Label.Group>
        );
      case totalCourses:
        return (
        <Label.Group size="medium">
          {totalCourses.map((course) => {
            const slug = itemToSlugName(course);
            return (
            <CourseLabel key={slug} size="medium" slug={slug} userID={profile.userID} />
            );
          })}
        </Label.Group>
        );
      case totalOpportunities:
        return (
        <Label.Group size="medium">
          {totalOpportunities.map((opportunity) => {
            const slug = itemToSlugName(opportunity);
            return (
            <OpportunityLabel key={slug} size="medium" slug={slug} userID={profile.userID} />
            );
          })}
        </Label.Group>
        );
      case totalStudents:
        return (
        <Label.Group size="medium">
          {totalStudents.map((student) => (
          <UserLabel size="small" username={student}  />
          ))}
        </Label.Group>
        );
      default:
        return <React.Fragment />;
    }
  };

  const CareerGoalList = () => entitiesList(totalCareerGoals);

  const InterestList = () => entitiesList(totalInterests);

  const CourseList = () => entitiesList(totalCourses);

  const OpportunityList = () => entitiesList(totalOpportunities);

  const StudentList = () => entitiesList(totalStudents);
  return (
  <RadGradSegment header={<RadGradHeader title='TASK 4: LABELS' icon='tags'/>}>
    <h3 className='ui header'> Career Goals </h3>
    <CareerGoalList/>
    <h3 className='ui header'> Courses </h3>
    <CourseList/>
    <h3 className='ui header'> Interests </h3>
    <InterestList/>
    <h3 className='ui header'> Opportunities </h3>
    <OpportunityList/>
    <h3 className='ui header'> Students </h3>
    <StudentList/>
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
