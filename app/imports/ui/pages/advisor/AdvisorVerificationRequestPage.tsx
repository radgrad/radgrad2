import * as React from 'react';
import { Container, Grid, Menu } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import AdvisorPendingVerificationWidget from '../../components/advisor/AdvisorPendingVerificationWidget';
import AdvisorEventVerificationWidget from '../../components/advisor/AdvisorEventVerificationWidget';
import AdvisorCompletedVerificationWidget from '../../components/advisor/AdvisorCompletedVerificationWidget';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
// eslint-disable-next-line no-unused-vars
import { IVerificationRequest } from '../../../typings/radgrad';

interface IAdvisorVerificationRequestPageProps {
  verificationRequests: IVerificationRequest[];
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
              <Grid.Row style={{ paddingBottom: '14px', paddingTop: '14px' }}>
                <HelpPanelWidget/>
              </Grid.Row>
            </Grid.Column>
            <Grid.Row>
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
                {activeItem === 'pending' ? <AdvisorPendingVerificationWidget
                  pendingVerifications={this.props.verificationRequests.filter(ele => ele.status === VerificationRequests.OPEN)}/> : undefined}
                {activeItem === 'event' ? <AdvisorEventVerificationWidget/> : undefined}
                {activeItem === 'completed' ? <AdvisorCompletedVerificationWidget/> : undefined}
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
}))(AdvisorVerificationRequestPageContainer);

export default AdvisorVerificationRequestPageContainerTracker;
