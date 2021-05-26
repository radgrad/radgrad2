import React from 'react';
import CareerGoalLabel from '../shared/label/CareerGoalLabel';
import { CareerGoal } from '../../../typings/radgrad';
import { getSlugFromEntityID } from './utilities/helper-functions';

interface WithCareerGoalProps {
  careerGoals : CareerGoal[];
}

const LandingCareerGoalList: React.FC<WithCareerGoalProps> = ({ careerGoals }) => (
<React.Fragment>
  {careerGoals.map((careerGoal) =>
  <CareerGoalLabel key={careerGoal._id} slug={getSlugFromEntityID(careerGoal._id)} size='small'/>)}
</React.Fragment>
);

export default LandingCareerGoalList;
