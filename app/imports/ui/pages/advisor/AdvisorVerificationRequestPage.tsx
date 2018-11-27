import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import NavBar from '../../components/NavBar';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';

/** A simple static component to render some text for the landing page. */
class AdvisorVerificationRequestPage extends React.Component {
  public render() {
    return (
      <div>
        <AdvisorPageMenuWidget/>
        <Grid verticalAlign="middle" textAlign="center" container={true}>

          <Grid.Column width={4}>
            <Image size="small" circular={true} src="/images/radgrad_logo.png"/>
          </Grid.Column>

          <Grid.Column width={8}>
            <h1>Advisor Verification Requests</h1>
          </Grid.Column>

        </Grid>
      </div>
    );
  }
}

const AdvisorVerificationRequestPageCon = withGlobalSubscription(AdvisorVerificationRequestPage);
const AdvisorVerificationRequestPageContainer = withInstanceSubscriptions(AdvisorVerificationRequestPageCon);

export default AdvisorVerificationRequestPageContainer;
