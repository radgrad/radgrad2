import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Tab } from 'semantic-ui-react';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { CareerGoal, Course, Interest, Opportunity } from '../../../../typings/radgrad';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';


interface Task7ComponentProps {
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
}

const Task7Component: React.FC<Task7ComponentProps> = ({ careerGoals, courses, interests, opportunities }) => {

  const panes = [
    { menuItem: 'Career Goals', render: () => <Tab.Pane>{careerGoals.map((careerGoal) => <button type='button'>{careerGoal.name}</button>)}</Tab.Pane> },
    { menuItem: 'Courses', render: () => <Tab.Pane>{courses.map((course) => <button type='button'>{course.name}</button>)}</Tab.Pane> },
    { menuItem: 'Interests', render: () => <Tab.Pane>{interests.map((interest) => <button type='button'>{interest.name}</button>)}</Tab.Pane> },
    { menuItem: 'Opportunities', render: () => <Tab.Pane>{opportunities.map((opportunity) => <button type='button'>{opportunity.name}</button>)}</Tab.Pane> },
  ];

  return (
    <RadGradSegment header={<RadGradHeader title='Task 7: Tabbed and Modal Components' dividing />}>
      <Tab panes={panes} />
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const careerGoals = CareerGoals.findNonRetired();
  const courses = Courses.findNonRetired();
  const interests = Interests.findNonRetired();
  const opportunities = Opportunities.findNonRetired();
  return {
    careerGoals,
    courses,
    interests,
    opportunities,
  };
})(Task7Component);