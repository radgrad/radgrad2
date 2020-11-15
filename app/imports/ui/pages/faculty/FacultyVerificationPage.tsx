import React, { useState } from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import PendingVerificationsWidget from '../../components/shared/verification-page/PendingVerificationsWidget';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import EventVerificationsWidget from '../../components/shared/verification-page/EventVerificationsWidget';
import { IOpportunity, IVerificationRequest } from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import CompletedVerificationsWidget from '../../components/shared/verification-page/CompletedVerificationsWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import withAdditionalSubscriptions from '../../layouts/shared/AdvisorFacultyAdditionalSubscriptionsHOC';

interface FacultyVerificationPageProps {
  verificationRequests: IVerificationRequest[];
  eventOpportunities: IOpportunity[];
  match: {
    params: {
      username: string;
    }
  }
}

const FacultyVerificationPage = (props: FacultyVerificationPageProps) => {
  const [activeItemState, setActiveItem] = useState('pending');

  const handleMenu = (e, { name }) => setActiveItem(name);

  return (
    <div id="faculty-verification-page">
      <FacultyPageMenuWidget />
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
      </Grid>

      <BackToTopButton />
    </div>
  );
};

const FacultyVerificationPageWithTracker = withTracker((props) => {
  const userID = Users.getID(props.match.params.username);
  const linkedOppInstances = OpportunityInstances.findNonRetired({ sponsorID: userID });
  const isLinkedReq = (verReq: IVerificationRequest) => !!linkedOppInstances.find(oppI => verReq.opportunityInstanceID === oppI._id);
  return {
    verificationRequests: VerificationRequests.findNonRetired().filter(ele => isLinkedReq(ele)),
    eventOpportunities: Opportunities.findNonRetired({ eventDate: { $exists: true } }),
  };
})(FacultyVerificationPage);
const FacultyVerificationPageWithRouter = withRouter(FacultyVerificationPageWithTracker);
const FacultyVerificationPageContainer = withAdditionalSubscriptions(FacultyVerificationPageWithRouter);

export default FacultyVerificationPageContainer;
