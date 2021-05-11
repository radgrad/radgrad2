import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import Markdown from 'react-markdown';
import { Divider, Header } from 'semantic-ui-react';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { CareerGoal } from '../../../../typings/radgrad';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';

interface Task3Props {
  careerGoals: CareerGoal[];
}

const Task3: React.FC<Task3Props> = ({ careerGoals }) => {
  const header = <RadGradHeader title="Task 3: A random Career Goal (refresh for a new one)"  icon='database' />;
  const randomElement = careerGoals[Math.floor(Math.random() * careerGoals.length)];
  return (
    <RadGradSegment header={header}>
      <Header>{randomElement.name}</Header>
      <Markdown source={randomElement.description} />
      <Divider/>
      <p>Note: The total number of career goals is: {careerGoals.length}</p>
    </RadGradSegment>
  );
};

const Task3Container = withTracker(() => {
  const careerGoals = CareerGoals.findNonRetired();
  return { careerGoals };
})(Task3);

export default Task3Container;
