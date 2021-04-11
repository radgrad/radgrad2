import React from 'react';
import RadGradHeader from '../RadGradHeader';
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
  const header = <RadGradHeader title={title} icon={icon} />;
  return (
    <RadGradSegment header={header}>
      Top 5 List.
    </RadGradSegment>
  );
};

export default MostPopular;
