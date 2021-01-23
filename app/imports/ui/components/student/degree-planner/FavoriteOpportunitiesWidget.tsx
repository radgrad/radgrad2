import React from 'react';
import { Card, Icon, Message } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { Opportunity, OpportunityInstance } from '../../../../typings/radgrad';
import * as Router from '../../shared/utilities/router';
import FavoriteOpportunityCard from './FavoriteOpportunityCard';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';

interface FavoriteOpportunitiesWidgetProps {
  studentID: string;
  opportunities: Opportunity[];
  opportunityInstances: OpportunityInstance[];
}

const FavoriteOpportunitiesWidget: React.FC<FavoriteOpportunitiesWidgetProps> = ({ studentID, opportunities, opportunityInstances }) => {
  const match = useRouteMatch();
  const hasFavorites = opportunities.length > 0;
  return (
    <div>
      {hasFavorites ? (
        <Card.Group itemsPerRow={1}>
          {_.map(opportunities, (o) => (
            <FavoriteOpportunityCard key={o._id} opportunity={o} studentID={studentID} opportunityInstances={opportunityInstances} />
          ))}
        </Card.Group>
      ) : (
        <Message>
          <Message.Header>No Favorite Opportunities</Message.Header>
          <p>You can favorite opportunities in the explorer.</p>
          <Link to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}`)}>
            View in Explorer <Icon name="arrow right" />
          </Link>
        </Message>
      )}
    </div>
  );
};

export default FavoriteOpportunitiesWidget;
