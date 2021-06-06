import React from 'react';
import Markdown from 'react-markdown';
import { withTracker } from 'meteor/react-meteor-data';
import RadGradSegment from '../../../app/imports/ui/components/shared/RadGradSegment';
import RadGradHeader from '../../../app/imports/ui/components/shared/RadGradHeader';
import { CareerGoal } from '../../../app/imports/typings/radgrad';
import { CareerGoals } from '../../../app/imports/api/career/CareerGoalCollection';

interface RandomCareerProps {
  careerGoals: CareerGoal[];
}

const Task3Segment: React.FC<RandomCareerProps> = ({ careerGoals }) => {
  const careerGoalSize = careerGoals.length;
  const randomID = Math.floor(Math.random() * careerGoalSize);
  const { name, description } = careerGoals[randomID];
  return (
    <RadGradSegment header={<RadGradHeader title='Task 3: A Random Career Goal (Refresh For A New One)' icon='database'/>}>
      <h3>{name}</h3>
      <Markdown source={description}/>
      <hr/>
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
