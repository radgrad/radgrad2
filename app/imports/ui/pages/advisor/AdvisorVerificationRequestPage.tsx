import React, { useState } from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import PendingVerificationsWidget from '../../components/shared/verification-page/PendingVerificationsWidget';
import EventVerificationsWidget from '../../components/shared/verification-page/EventVerificationsWidget';
import CompletedVerificationsWidget from '../../components/shared/verification-page/CompletedVerificationsWidget';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { IOpportunity, IVerificationRequest } from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import BackToTopButton from '../../components/shared/BackToTopButton';
import withAdditionalSubscriptions from '../../layouts/utilities/AdvisorFacultyAdditionalSubscriptionsHOC';

interface IAdvisorVerificationRequestPageProps {
  verificationRequests: IVerificationRequest[];
  eventOpportunities: IOpportunity[];
  match: {
    params: {
      username: string;
    }
  }
}

const AdvisorVerificationRequestPage = (props: IAdvisorVerificationRequestPageProps) => {
  const [activeItemState, setActiveItem] = useState('pending');

  const handleMenu = (e, { name }) => setActiveItem(name);

  return (
    <div id="advisor-verification-requests-page">
      <AdvisorPageMenuWidget />
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
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
                pendingVerifications={props.verificationRequests.filter(ele => ele.status === VerificationRequests.OPEN)}
              />
              )
              : undefined}
            {activeItemState === 'event' ?
              <EventVerificationsWidget eventOpportunities={props.eventOpportunities} />
              : undefined}
            {activeItemState === 'completed' ? (
              <CompletedVerificationsWidget
                username={props.match.params.username}
                completedVerifications={props.verificationRequests.filter(ele => VerificationRequests.ACCEPTED === ele.status || ele.status === VerificationRequests.REJECTED)}
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
  eventOpportunities: Opportunities.findNonRetired({ eventDate: { $exists: true } }),
}))(AdvisorVerificationRequestPage);
const AdvisorVerificationRequestPageContainerTrackerRouter = withRouter(AdvisorVerificationRequestPageContainerTracker);

export default withAdditionalSubscriptions(AdvisorVerificationRequestPageContainerTrackerRouter);
