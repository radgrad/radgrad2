import React, { useState } from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import PendingVerificationsWidget from '../../components/shared/verification/PendingVerificationsWidget';
import EventVerificationsWidget from '../../components/shared/verification/EventVerificationsWidget';
import CompletedVerificationsWidget from '../../components/shared/verification/CompletedVerificationsWidget';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { HelpMessage, Opportunity, VerificationRequest } from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import BackToTopButton from '../../components/shared/BackToTopButton';
import withAdditionalSubscriptions from '../../layouts/utilities/AdvisorFacultyAdditionalSubscriptionsHOC';

interface AdvisorVerificationRequestPageProps {
  verificationRequests: VerificationRequest[];
  eventOpportunities: Opportunity[];
  helpMessages: HelpMessage[];
}

const AdvisorVerificationRequestPage: React.FC<AdvisorVerificationRequestPageProps> = ({ verificationRequests, eventOpportunities, helpMessages }) => {
  const { username } = useParams();
  const [activeItemState, setActiveItem] = useState('pending');

  const handleMenu = (e, { name }) => setActiveItem(name);

  return (
    <div id="advisor-verification-requests-page">
      <AdvisorPageMenuWidget />
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={3}>
            <Menu vertical>
              <Menu.Item
                name="pending"
                active={activeItemState === 'pending'}
                onClick={handleMenu}
              >
                Pending Verifications
              </Menu.Item>
              <Menu.Item
                name="event"
                active={activeItemState === 'event'}
                onClick={handleMenu}
              >
                Event Verifications
              </Menu.Item>
              <Menu.Item
                name="completed"
                active={activeItemState === 'completed'}
                onClick={handleMenu}
              >
                Completed Verifications
              </Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column width={11}>
            {activeItemState === 'pending' ? (
              <PendingVerificationsWidget
                pendingVerifications={verificationRequests.filter(ele => ele.status === VerificationRequests.OPEN)}
              />
            )
              : undefined}
            {activeItemState === 'event' ?
              <EventVerificationsWidget eventOpportunities={eventOpportunities} />
              : undefined}
            {activeItemState === 'completed' ? (
              <CompletedVerificationsWidget
                username={username}
                completedVerifications={verificationRequests.filter(ele => VerificationRequests.ACCEPTED === ele.status || ele.status === VerificationRequests.REJECTED)}
              />
            )
              : undefined}
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
        {/* </Grid.Column> */}
      </Grid>

      <BackToTopButton />
    </div>
  );
};

const AdvisorVerificationRequestPageContainerTracker = withTracker(() => ({
  verificationRequests: VerificationRequests.findNonRetired({}),
  eventOpportunities: Opportunities.findNonRetired({ eventDate: { $exists: true },
  }),
  helpMessages: HelpMessages.findNonRetired({}),
}))(AdvisorVerificationRequestPage);
export default withAdditionalSubscriptions(AdvisorVerificationRequestPageContainerTracker);
