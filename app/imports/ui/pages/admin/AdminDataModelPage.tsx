import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';

/** A simple static component to render some text for the landing page. */
class AdminDataModelPage extends React.Component {
  public render() {
    const paddedStyle = {
      paddingTop: 20,
    };
    return (
      <div>
        <AdminPageMenuWidget/>
        <Grid container={true} stackable={true} style={paddedStyle}>

          <Grid.Column width={5}>
            <AdminDataModelMenu/>
          </Grid.Column>

          <Grid.Column width={8}>
            <h1>Admin Data Model</h1>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const AdminDataModelPageCon = withGlobalSubscription(AdminDataModelPage);
const AdminDataModelPageContainer = withInstanceSubscriptions(AdminDataModelPageCon);

export default AdminDataModelPageContainer;
