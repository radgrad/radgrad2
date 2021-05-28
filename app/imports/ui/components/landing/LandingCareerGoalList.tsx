import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import CareerGoalLabel from '../shared/label/CareerGoalLabel';
import { CareerGoal } from '../../../typings/radgrad';
import { getSlugFromEntityID } from './utilities/helper-functions';

interface LandingCareerGoalListProps {
  careerGoals: CareerGoal[];
  size: SemanticSIZES;
}

const LandingCareerGoalList: React.FC<LandingCareerGoalListProps> = ({ size, careerGoals }) => (
  <Label.Group size={size}>
    {careerGoals.map((careerGoal) =>
      <CareerGoalLabel key={careerGoal._id} slug={getSlugFromEntityID(careerGoal._id)} size={size} />)}
  </Label.Group>
);

export default LandingCareerGoalList;
