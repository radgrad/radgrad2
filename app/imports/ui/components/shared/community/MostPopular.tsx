import React from 'react';
import RadGradSegment from '../RadGradSegment';

export const enum MOSTPOPULAR {
  INTEREST = 'INTEREST',
  CAREERGOAL = 'CAREERGOAL',
}

interface MostPopularProps {
  type: MOSTPOPULAR;
}

const MostPopular: React.FC<MostPopularProps> = ({ type }) => {
  const icon = (type === MOSTPOPULAR.CAREERGOAL) ? 'briefcase' : 'lightbulb outline';
  const title = (type === MOSTPOPULAR.CAREERGOAL) ? 'Top 5 Career Goals' : 'Top 5 Interests';
  return (
    <RadGradSegment icon={icon} title={title}>
      Top 5 List.
    </RadGradSegment>
  );
};

export default MostPopular;
