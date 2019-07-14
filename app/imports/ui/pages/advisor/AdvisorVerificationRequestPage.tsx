import * as React from 'react';
import { Container, Grid, Menu } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import PendingVerificationsWidget from '../../components/shared/PendingVerificationsWidget';
import EventVerificationsWidget from '../../components/shared/EventVerificationsWidget';
import CompletedVerificationsWidget from '../../components/shared/CompletedVerificationsWidget';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
// eslint-disable-next-line no-unused-vars
import { IOpportunity, IVerificationRequest } from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import BackToTopButton from '../../components/shared/BackToTopButton';
import withAdditionalSubscriptions from '../../layouts/shared/AdvisorFacultyAdditionalSubscriptionsHOC';

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
        <Grid stackable={true}>
          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={14}><HelpPanelWidget/></Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={3}>
              <Menu vertical={true}>
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
              {activeItem === 'pending' ?
                <PendingVerificationsWidget
                  pendingVerifications={this.props.verificationRequests.filter(ele => ele.status === VerificationRequests.OPEN)}/>
                : undefined}
              {activeItem === 'event' ?
                <EventVerificationsWidget eventOpportunities={this.props.eventOpportunities}/>
                : undefined}
              {activeItem === 'completed' ?
                <CompletedVerificationsWidget username={this.props.match.params.username}
                                              completedVerifications={this.props.verificationRequests.filter(ele => VerificationRequests.ACCEPTED === ele.status || ele.status === VerificationRequests.REJECTED)}/>
                : undefined}
            </Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>
          {/* </Grid.Column> */}
        </Grid>

        <BackToTopButton/>
      </div>
    );
  }
}

const AdvisorVerificationRequestPageContainerTracker = withTracker(() => ({
  verificationRequests: VerificationRequests.find({}).fetch(),
  eventOpportunities: Opportunities.find({ eventDate: { $exists: true } }).fetch(),
}))(AdvisorVerificationRequestPage);
const AdvisorVerificationRequestPageContainerTrackerRouter = withRouter(AdvisorVerificationRequestPageContainerTracker);

export default withAdditionalSubscriptions(AdvisorVerificationRequestPageContainerTrackerRouter);
