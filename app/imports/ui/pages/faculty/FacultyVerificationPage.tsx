import * as React from 'react';
import { Container, Grid, Menu } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import PendingVerificationsWidget from '../../components/shared/PendingVerificationsWidget';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import EventVerificationsWidget from '../../components/shared/EventVerificationsWidget';
// eslint-disable-next-line no-unused-vars
import { IOpportunity, IVerificationRequest } from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import CompletedVerificationsWidget from '../../components/shared/CompletedVerificationsWidget';
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

class FacultyVerificationPage extends React.Component<FacultyVerificationPageProps> {
  state = { activeItem: 'pending' };

  handleMenu = (e, { name }) => this.setState({ activeItem: name });

  public render() {
    const { activeItem } = this.state;
    return (
      <div>
        <FacultyPageMenuWidget/>
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
        </Grid>

        <BackToTopButton/>
      </div>
    );
  }
}

const FacultyVerificationPageWithTracker = withTracker((props) => {
  const userID = Users.getID(props.match.params.username);
  const linkedOppInstances = OpportunityInstances.findNonRetired({ sponsorID: userID });
  const isLinkedReq = (verReq: IVerificationRequest) => !!linkedOppInstances.find(oppI => verReq.opportunityInstanceID === oppI._id);
  return {
    verificationRequests: VerificationRequests.findNonRetired().filter(ele => isLinkedReq(ele)),
    eventOpportunities: Opportunities.find({ eventDate: { $exists: true } }).fetch(),
  };
})(FacultyVerificationPage);
const FacultyVerificationPageWithRouter = withRouter(FacultyVerificationPageWithTracker);
const FacultyVerificationPageContainer = withAdditionalSubscriptions(FacultyVerificationPageWithRouter);

export default FacultyVerificationPageContainer;
