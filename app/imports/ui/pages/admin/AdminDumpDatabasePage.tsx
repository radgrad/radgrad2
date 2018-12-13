import * as React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDatabaseMenuContainer from '../../components/admin/AdminDatabaseMenu';

/** A simple static component to render some text for the landing page. */
class AdminDumpDatabasePage extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    const paddedStyle = {
      paddingTop: 20,
    };
    return (
      <div>
        <AdminPageMenuWidget/>
        <Grid container={true} stackable={true} style={paddedStyle}>

          <Grid.Column width={5}>
            <AdminDatabaseMenuContainer/>
          </Grid.Column>

          <Grid.Column width={11}>
            buttons to dump the database
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const AdminDumpDatabasePageContainer = withGlobalSubscription(AdminDumpDatabasePage);

export default AdminDumpDatabasePageContainer;
