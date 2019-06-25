import * as React from 'react';
import { Container, Grid, Menu } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import PendingVerificationsWidget from '../../components/shared/PendingVerificationsWidget';
import EventVerificationsWidget from '../../components/shared/EventVerificationsWidget';
import AdvisorCompletedVerificationWidget from '../../components/advisor/AdvisorCompletedVerificationWidget';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
// eslint-disable-next-line no-unused-vars
import { IOpportunity, IVerificationRequest } from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';

interface IAdvisorVerificationRequestPageProps {
  verificationRequests: IVerificationRequest[];
  eventOpportunities: IOpportunity[];
  match: {
    params: {
      username: string;
    }
  }
}

/** A simple static component to render some text for the landing page. */
class AdvisorVerificationRequestPage extends React.Component<IAdvisorVerificationRequestPageProps> {
  state = { activeItem: 'pending' };

  handleMenu = (e, { name }) => this.setState({ activeItem: name });

  public render() {
    const { activeItem } = this.state;
    return (
      <div>
        <AdvisorPageMenuWidget/>
        <Container fluid={false}>
          <Grid stackable={true}>
            <Grid.Column width={14}>
              <Grid.Row style={{ paddingBottom: '0px', paddingTop: '14px' }}>
                <HelpPanelWidgetContainer/>
              </Grid.Row>
            </Grid.Column>
            <Grid.Row style={{ paddingTop: '0px' }}>
              <Grid.Column width={3}>
                <Menu vertical={true} text={true}>
                  <Menu.Item name={'pending'}
                             active={activeItem === 'pending'}
                             onClick={this.handleMenu}>
                    Pending Verifications
                  </Menu.Item>
                  <Menu.Item name={'event'}
                             active={activeItem === 'event'}
                             onClick={this.handleMenu}>
                    Event Verifications
                  </Menu.Item>
                  <Menu.Item name={'completed'}
                             active={activeItem === 'completed'}
                             onClick={this.handleMenu}>
                    Completed Verifications
                  </Menu.Item>
                </Menu>
              </Grid.Column>
              <Grid.Column width={11}>
                {activeItem === 'pending' ? <PendingVerificationsWidget
                  pendingVerifications={this.props.verificationRequests.filter(ele => ele.status === VerificationRequests.OPEN)}/> : undefined}
                {activeItem === 'event' ?
                  <EventVerificationsWidget eventOpportunities={this.props.eventOpportunities}/> : undefined}
                {activeItem === 'completed' ?
                  <AdvisorCompletedVerificationWidget username={this.props.match.params.username}
                                                      completedVerifications={this.props.verificationRequests.filter(ele => VerificationRequests.ACCEPTED === ele.status || ele.status === VerificationRequests.REJECTED)}/> : undefined}
              </Grid.Column>
            </Grid.Row>
            {/* </Grid.Column> */}
          </Grid>
        </Container>
      </div>
    );
  }
}

const AdvisorVerificationRequestPageCon = withGlobalSubscription(AdvisorVerificationRequestPage);
const AdvisorVerificationRequestPageContainer = withInstanceSubscriptions(AdvisorVerificationRequestPageCon);
const AdvisorVerificationRequestPageContainerTracker = withTracker(() => ({
  verificationRequests: VerificationRequests.findNonRetired(),
  eventOpportunities: Opportunities.find({ eventDate: { $exists: true } }).fetch(),
}))(AdvisorVerificationRequestPageContainer);
const AdvisorVerificationRequestPageContainerTrackerRouter = withRouter(AdvisorVerificationRequestPageContainerTracker);

export default AdvisorVerificationRequestPageContainerTrackerRouter;
