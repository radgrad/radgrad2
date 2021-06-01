import React from 'react';
import Markdown from 'react-markdown';
import { withTracker } from 'meteor/react-meteor-data';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import { CareerGoal } from '../../../../typings/radgrad';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';

interface Task3CareerGoalsProps {
  careerGoals: CareerGoal[];
}

const Task3: React.FC<Task3CareerGoalsProps> = ({ careerGoals }) => {
  const headerTask3 = <RadGradHeader title='TASK 3: A RANDOM CAREER GOAL (REFRESH FOR A NEW ONE)' icon='database' dividing />;

  // https://stackoverflow.com/questions/9286473/whats-the-equivalent-of-sample-in-javascript
  const careerGoalsTotal = careerGoals.length;
  const { name, description } = careerGoals[Math.floor(Math.random() * careerGoalsTotal)];
  const subheaderTask3 = <RadGradHeader title={ name }/>;

  return (
    <RadGradSegment header={headerTask3}>
      {subheaderTask3}
      <Markdown source={description}/>
      <hr/>
      <p>
                Note: The total number of career goals is: {careerGoalsTotal}
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
