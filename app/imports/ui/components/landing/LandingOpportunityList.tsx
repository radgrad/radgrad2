import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import OpportunityLabel from '../shared/label/OpportunityLabel';
import { Opportunity } from '../../../typings/radgrad';
import { getSlugFromEntityID } from './utilities/helper-functions';

interface LandingOpportunityListProps {
  opportunities: Opportunity[];
  size: SemanticSIZES;
}

const LandingOpportunityList: React.FC<LandingOpportunityListProps> = ({ size, opportunities }) => (
  <Label.Group size={size}>
    {opportunities.map((opportunity) =>
      <OpportunityLabel key={opportunity._id} slug={getSlugFromEntityID(opportunity._id)} size={size} />)}
  </Label.Group>
);

export default LandingOpportunityList;
