import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';

/** A simple static component to render some text for the landing page. */
class FacultyVerificationPage extends React.Component {
  public render() {
    return (
      <div>
        <FacultyPageMenuWidget/>
        <Grid verticalAlign="middle" textAlign="center" container={true}>

          <Grid.Column width={4}>
            <Image size="small" circular={true} src="/images/radgrad_logo.png"/>
          </Grid.Column>

          <Grid.Column width={8}>
            <h1>Faculty Verification</h1>
          </Grid.Column>

        </Grid>
      </div>
    );
  }
}

const FacultyVerificationPageCon = withGlobalSubscription(FacultyVerificationPage);
const FacultyVerificationPageContainer = withInstanceSubscriptions(FacultyVerificationPageCon);

export default FacultyVerificationPageContainer;
