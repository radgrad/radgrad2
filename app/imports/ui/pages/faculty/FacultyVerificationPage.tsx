import React, { useState } from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { useParams, useRouteMatch } from 'react-router-dom';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import PendingVerificationsWidget from '../../components/shared/verification/PendingVerificationsWidget';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import EventVerificationsWidget from '../../components/shared/verification/EventVerificationsWidget';
import { IHelpMessage, IOpportunity, IVerificationRequest } from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import CompletedVerificationsWidget from '../../components/shared/verification/CompletedVerificationsWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { withListSubscriptions } from '../../layouts/utilities/SubscriptionListHOC';
import withAdditionalSubscriptions from '../../layouts/utilities/AdvisorFacultyAdditionalSubscriptionsHOC';

interface IFacultyVerificationPageProps {
  verificationRequests: IVerificationRequest[];
  eventOpportunities: IOpportunity[];
  helpMessages: IHelpMessage[];
}

const FacultyVerificationPage: React.FC<IFacultyVerificationPageProps> = ({ verificationRequests, helpMessages, eventOpportunities }) => {
  const match = useRouteMatch();
  const [activeItemState, setActiveItem] = useState('pending');

  const handleMenu = (e, { name }) => setActiveItem(name);

  return (
    <div id="faculty-verification-page">
      <FacultyPageMenuWidget />
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
                username={match.params.username}
                completedVerifications={verificationRequests.filter(ele => VerificationRequests.ACCEPTED === ele.status || ele.status === VerificationRequests.REJECTED)}
              />
            )
              : undefined}
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>

      <BackToTopButton />
    </div>
  );
};

const FacultyVerificationPageWithTracker = withTracker(() => {
  const { username } = useParams();
  const userID = Users.getID(username);
  const linkedOppInstances = OpportunityInstances.findNonRetired({ sponsorID: userID });
  const isLinkedReq = (verReq: IVerificationRequest) => !!linkedOppInstances.find(oppI => verReq.opportunityInstanceID === oppI._id);
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    verificationRequests: VerificationRequests.findNonRetired().filter(ele => isLinkedReq(ele)),
    eventOpportunities: Opportunities.findNonRetired({ eventDate: { $exists: true } }),
    helpMessages,
  };
})(FacultyVerificationPage);
const FacultyVerificationPageContainer = withAdditionalSubscriptions(withListSubscriptions(FacultyVerificationPageWithTracker, [
  HelpMessages.getPublicationName(),
  Opportunities.getPublicationName(),
  OpportunityInstances.getPublicationName(),
  VerificationRequests.getPublicationName(),
]));

export default FacultyVerificationPageContainer;
