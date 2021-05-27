import React from 'react';
import { Label } from 'semantic-ui-react';
import OpportunityLabel from '../shared/label/OpportunityLabel';
import { Opportunity } from '../../../typings/radgrad';
import { getSlugFromEntityID } from './utilities/helper-functions';

interface WithOpportunitiesProps {
  opportunities : Opportunity[];
}

const LandingOpportunityList: React.FC<WithOpportunitiesProps> = ({ opportunities }) => (
  <Label.Group>
    {opportunities.map((opportunity) =>
    <OpportunityLabel key={opportunity._id} slug={getSlugFromEntityID(opportunity._id)} size='small'/>)}
  </Label.Group>
);

export default LandingOpportunityList;
