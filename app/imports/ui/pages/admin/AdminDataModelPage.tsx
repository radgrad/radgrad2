import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import { withGlobalSubscription } from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';

/** A simple static component to render some text for the landing page. */
class AdminDataModelPage extends React.Component {
  public render() {
    return (
      <div>
        <AdminPageMenuWidget/>
        <Grid verticalAlign="middle" textAlign="center" container={true}>

          <Grid.Column width={4}>
            <Image size="small" circular={true} src="/images/radgrad_logo.png"/>
          </Grid.Column>

          <Grid.Column width={8}>
            <h1>Admin Data Model</h1>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const AdminDataModelPageContainer = withGlobalSubscription(AdminDataModelPage);

export default AdminDataModelPageContainer;
