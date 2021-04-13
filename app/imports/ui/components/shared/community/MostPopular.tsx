import React from 'react';
import CareerGoalLabel from '../label/CareerGoalLabel';
import InterestLabel from '../label/InterestLabel';
import OpportunityLabel from '../label/OpportunityLabel';
import RadGradHeader from '../RadGradHeader';
import RadGradSegment from '../RadGradSegment';

export const enum MOSTPOPULAR {
  INTEREST = 'INTEREST',
  CAREERGOAL = 'CAREERGOAL',
  OPPORTUNITY = 'OPPORTUNITY',
}

interface MostPopularProps {
  type: MOSTPOPULAR;
  data: Array<[string, number]>;
}

const MostPopular: React.FC<MostPopularProps> = ({ type, data }) => {
  let icon;
  let title;
  let labels;
  if (type === MOSTPOPULAR.CAREERGOAL) {
    icon = 'briefcase';
    title = 'Popular Careers';
    labels = data && data.map(pair => <div key={pair[0]}><CareerGoalLabel slug={pair[0]} rightside={` (${pair[1]})`}/></div>);
  } else if (type === MOSTPOPULAR.INTEREST) {
    icon = 'heart outline';
    title = 'Popular Interests';
    labels = data && data.map(pair => <div key={pair[0]}><InterestLabel slug={pair[0]} rightside={` (${pair[1]})`}/></div>);
  } else if (type === MOSTPOPULAR.OPPORTUNITY) {
    icon = 'lightbulb outline';
    title = 'Popular Opportunities';
    labels = data && data.map(pair => <div key={pair[0]}><OpportunityLabel slug={pair[0]} rightside={` (${pair[1]})`}/></div>);
  }
  const header = <RadGradHeader title={title} icon={icon} />;
  return (
    <RadGradSegment header={header}>
      {labels}
    </RadGradSegment>
  );
};

export default MostPopular;
