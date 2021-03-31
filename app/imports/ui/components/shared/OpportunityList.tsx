import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Opportunity } from '../../../typings/radgrad';
import OpportunityLabel from './label/OpportunityLabel';
import { itemToSlugName } from './utilities/data-model';

interface OpportunityListProps {
  opportunities: Opportunity[];
  size: SemanticSIZES;
  keyStr: string;
  userID: string;
}

const OpportunityList: React.FC<OpportunityListProps> = ({ opportunities, size, keyStr, userID }) => (
  <Label.Group size={size}>
    {opportunities.map((opp) => {
      const slug = itemToSlugName(opp);
      return (
        <OpportunityLabel key={slug} slug={slug} userID={userID} size={size} />
      );
    })}
  </Label.Group>
);

export default OpportunityList;
