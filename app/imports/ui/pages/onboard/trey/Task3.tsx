import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import Markdown from 'react-markdown';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { CareerGoal } from '../../../../typings/radgrad';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';

interface Task3Props {
  careerGoals: CareerGoal[];
}

const Task3: React.FC<Task3Props> = ({ careerGoals }) => {

  const totalCareerGoals = careerGoals.length;
  // code for grabbing a random career from the array can be found here: https://attacomsian.com/blog/javascript-get-random-value-from-array
  const { name, description } = careerGoals[Math.floor(Math.random() * totalCareerGoals)];

  return (
    <RadGradSegment header={<RadGradHeader title='TASK 3: A RANDOM CAREER GOAL (REFRESH FOR A NEW ONE)' icon='database' dividing />}>
      <RadGradHeader title={name} dividing={false}/>
      <Markdown source={description}/>
      <hr/>
      <p>
        Note: The total number of career goals is: {totalCareerGoals}
      </p>
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const careerGoals = CareerGoals.findNonRetired();
  return {
    careerGoals,
  };
})(Task3);