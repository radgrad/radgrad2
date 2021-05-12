import React from 'react';
import { Opportunity } from '../../../typings/radgrad';
import OpportunityList from './OpportunityList';
import RadGradHeader from './RadGradHeader';
import RadGradSegment from './RadGradSegment';
import { EXPLORER_TYPE_ICON } from '../../utilities/ExplorerUtils';

interface RelatedOpportunitiesProps {
  opportunities: Opportunity[];
  userID: string;
}

const RelatedOpportunities: React.FC<RelatedOpportunitiesProps> = ({ opportunities, userID }) => {
  const header = <RadGradHeader title='related opportunities' icon={EXPLORER_TYPE_ICON.OPPORTUNITY} />;
  return (
    <RadGradSegment header={header}>
      <OpportunityList opportunities={opportunities} keyStr='related-opportunities' size='medium' userID={userID} />
    </RadGradSegment>
  );
};

export default RelatedOpportunities;
