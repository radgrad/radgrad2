import React from 'react';
import Markdown from 'react-markdown';
import { withTracker } from 'meteor/react-meteor-data';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import { CareerGoal } from '../../../../typings/radgrad';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';

interface RandomCareerProps {
  careerGoals: CareerGoal[];
}

const Task3Segment: React.FC<RandomCareerProps> = ({ careerGoals }) => {
  const careerGoalSize = careerGoals.length;
  const randomID = Math.floor(Math.random() * careerGoalSize);
  const { name, description } = careerGoals[randomID];
  return (
    <RadGradSegment header={<RadGradHeader title='Task Three: A Random Career Goal (Refresh For A New One)' icon='database'/>}>
      <RadGradHeader title={name}/>
      <Markdown source={description}/>
      Note: The total number of career goals is: {careerGoalSize}
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const careerGoals = CareerGoals.findNonRetired();
  return {
    careerGoals,
  };
})(Task3Segment);
