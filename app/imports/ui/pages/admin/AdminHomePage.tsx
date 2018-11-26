import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import SecondMenu from '../shared/SecondMenu';
import { withGlobalSubscription } from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';

/** A simple static component to render some text for the landing page. */
class AdminHomePage extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (
      <div>
        <AdminPageMenuWidget/>
        <Grid verticalAlign="middle" textAlign="center" container={true}>

          <Grid.Column width={4}>
            <Image size="small" circular={true} src="/images/radgrad_logo.png"/>
          </Grid.Column>

          <Grid.Column width={8}>
            <h1>Admin Home</h1>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const AdminHomePageCon = withGlobalSubscription(AdminHomePage);
const AdminHomePageContainer = withInstanceSubscriptions(AdminHomePageCon);

export default AdminHomePageContainer;
