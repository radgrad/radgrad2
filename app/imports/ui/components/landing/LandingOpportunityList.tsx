import React from 'react';
import OpportunityLabel from '../shared/label/OpportunityLabel';
import { Opportunity } from '../../../typings/radgrad';
import { getSlugFromEntityID } from './utilities/helper-functions';

interface WithOpportunitiesProps {
  opportunities : Opportunity[];
}

const LandingOpportunityList: React.FC<WithOpportunitiesProps> = ({ opportunities }) => (
  <React.Fragment>
    {opportunities.map((opportunity) =>
    <OpportunityLabel key={opportunity._id} slug={getSlugFromEntityID(opportunity._id)} size='small'/>)}
  </React.Fragment>
);

export default LandingOpportunityList;
