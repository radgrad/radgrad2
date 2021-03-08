import React from 'react';
import { Card, Icon, Message } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { Opportunity, OpportunityInstance } from '../../../../typings/radgrad';
import * as Router from '../../shared/utilities/router';
import ProfileOpportunityCard from './ProfileOpportunityCard';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';

interface ProfileOpportunitiesProps {
  studentID: string;
  opportunities: Opportunity[];
  opportunityInstances: OpportunityInstance[];
}

const ProfileOpportunities: React.FC<ProfileOpportunitiesProps> = ({ studentID, opportunities, opportunityInstances }) => {
  const match = useRouteMatch();
  const hasProfileEntries = opportunities.length > 0;
  return (
    <div>
      {hasProfileEntries ? (
        <Card.Group itemsPerRow={1}>
          {_.map(opportunities, (o) => (
            <ProfileOpportunityCard key={o._id} opportunity={o} studentID={studentID} opportunityInstances={opportunityInstances} />
          ))}
        </Card.Group>
      ) : (
        <Message>
          <Message.Header>No Profile Opportunities</Message.Header>
          <p>You can add opportunities to your profile in the explorer.</p>
          <Link to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}`)}>
            View in Explorer <Icon name="arrow right" />
          </Link>
        </Message>
      )}
    </div>
  );
};

export default ProfileOpportunities;
