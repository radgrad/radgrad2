import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Markdown from 'react-markdown';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { CareerGoal } from '../../../../typings/radgrad';

export interface Task3SegmentProps {
  careerGoals: CareerGoal[]
}

const Task3: React.FC<Task3SegmentProps> = ({ careerGoals }) => {
  const Task3Header = <RadGradHeader title="TASK 3: A RANDOM CAREER GOAL(REFRESH FOR A NEW ONE)" icon="database" />;
  const totalCareer = careerGoals.length;
  const { name, description } = careerGoals[Math.floor(Math.random() * totalCareer)];
  return (
    <RadGradSegment header={Task3Header}>
      <RadGradHeader title={name} />
      <Markdown source={description} />
      <hr />
      <p>Note: The total number of jobs is: {totalCareer}.</p>
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const careerGoals = CareerGoals.findNonRetired();
  return {
    careerGoals,
  };
})(Task3);
