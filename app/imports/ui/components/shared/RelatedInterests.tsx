import React from 'react';
import InterestList from './InterestList';
import RadGradHeader from './RadGradHeader';
import RadGradSegment from './RadGradSegment';
import { EXPLORER_TYPE_ICON } from '../../utilities/ExplorerUtils';

interface RelatedInterestsProps {
  item: {
    interestIDs: string[];
  };
}

const RelatedInterests: React.FC<RelatedInterestsProps> = ({ item }) => {
  const header = <RadGradHeader title='related interests' icon={EXPLORER_TYPE_ICON.INTEREST} />;
  return (
    <RadGradSegment header={header}>
      <InterestList item={item} size='medium' />
    </RadGradSegment>
  );
};

export default RelatedInterests;
