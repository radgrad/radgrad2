import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { CareerGoal } from '../../../typings/radgrad';
import CareerGoalLabel from './label/CareerGoalLabel';
import { itemToSlugName } from './utilities/data-model';

interface CareerGoalListProps {
  CareerGoals: CareerGoal[];
  keyStr: string;
  size: SemanticSIZES;
  userID: string;
}

const CareerGoalList: React.FC<CareerGoalListProps> = ({ CareerGoals, size, keyStr, userID }) => (
  <Label.Group size={size}>
    {CareerGoals.map((goal) => {
      const slug = itemToSlugName(goal);
      return (
        <CareerGoalLabel key={slug} slug={slug} userID={userID} size={size} />
      );
    },
    )}
  </Label.Group>
);

export default CareerGoalList;
