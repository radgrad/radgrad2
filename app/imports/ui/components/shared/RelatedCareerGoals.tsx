import React from 'react';
import { CareerGoal } from '../../../typings/radgrad';
import CareerGoalList from './CareerGoalList';
import RadGradHeader from './RadGradHeader';
import RadGradSegment from './RadGradSegment';
import { EXPLORER_TYPE_ICON } from '../../utilities/ExplorerUtils';

interface RelatedCareerGoalsProps {
  careerGoals: CareerGoal[];
  userID: string;
}

const RelatedCareerGoals: React.FC<RelatedCareerGoalsProps> = ({ careerGoals, userID }) => {
  const header = <RadGradHeader title='related career goals' icon={EXPLORER_TYPE_ICON.CAREERGOAL} />;
  return (
    <RadGradSegment header={header}>
      <CareerGoalList CareerGoals={careerGoals} keyStr='related-goals' size='medium' userID={userID} />
    </RadGradSegment>
  );
};

export default RelatedCareerGoals;
 