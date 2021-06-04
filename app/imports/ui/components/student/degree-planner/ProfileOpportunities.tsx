import React from 'react';
import { Message } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { Opportunity, OpportunityInstance } from '../../../../typings/radgrad';
import { ButtonLink } from '../../shared/button/ButtonLink';
import * as Router from '../../shared/utilities/router';
import ProfileOpportunityAccordion from './ProfileOpportunityAccordion';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';

interface ProfileOpportunitiesProps {
  studentID: string;
  opportunities: Opportunity[];
  opportunityInstances: OpportunityInstance[];
}

const ProfileOpportunities: React.FC<ProfileOpportunitiesProps> = ({
  studentID,
  opportunities,
  opportunityInstances,
}) => {
  const match = useRouteMatch();
  const hasProfileEntries = opportunities?.length > 0;
  return (
    <div>
      {hasProfileEntries ?
        opportunities.map((opportunity) => <ProfileOpportunityAccordion key={opportunity._id} studentID={studentID} opportunity={opportunity} opportunityInstances={opportunityInstances} />)
        :
        <Message>
          <Message.Header>No Profile Opportunities</Message.Header>
          <p>You can add opportunities to your profile in the explorer.</p>
          <ButtonLink url={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}`)}
            label='View in Explorer' />
        </Message>
      }
    </div>
  );
};

export default ProfileOpportunities;
