import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Opportunity } from '../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../layouts/utilities/route-constants';
import { itemToSlugName } from './utilities/data-model';
import * as Router from './utilities/router';

interface OpportunityListProps {
  opportunities: Opportunity[];
  size: SemanticSIZES;
}

const OpportunityList:React.FC<OpportunityListProps> = ({ opportunities, size }) => {
  const match = useRouteMatch();
  return (
    <Label.Group size={size}>
      {opportunities.map((opp) => {
        const slug = itemToSlugName(opp);
        return (
          <Label as={Link} key={opp._id}
                 to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${slug}`)}
                 size={size}>
            {opp.name}
          </Label>
        );
      })}
    </Label.Group>
  );
};

export default OpportunityList;
