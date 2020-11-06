import React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDatabaseMenuContainer from '../../components/admin/AdminDatabaseMenu';

const AdminDatabasePage = () => (
  <div id="admin-database-page">
    <AdminPageMenuWidget />
    <Grid container stackable>

      <Grid.Column width={3}>
        <AdminDatabaseMenuContainer />
      </Grid.Column>

      <Grid.Column width={13}>
        <Message floating>
          Click on a page in the menu to the left.
        </Message>
      </Grid.Column>
    </Grid>
  </div>
);
export default AdminDatabasePage;
