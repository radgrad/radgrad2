import React from 'react';
import InterestList from './InterestList';
import RadGradHeader from './RadGradHeader';
import RadGradSegment from './RadGradSegment';

interface RelatedInterestsProps {
  item: {
    interestIDs: string[];
  };
}

const RelatedInterests: React.FC<RelatedInterestsProps> = ({ item }) => {
  const header = <RadGradHeader title='related interests' icon='heart' />;
  return (
    <RadGradSegment header={header}>
      <InterestList item={item} size='medium' />
    </RadGradSegment>
  );
};

export default RelatedInterests;
