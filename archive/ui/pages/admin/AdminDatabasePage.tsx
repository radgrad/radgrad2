import React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import AdminPageMenu from '../../../../app/imports/ui/components/admin/AdminPageMenu';
import AdminDatabaseMenu from '../../../../app/imports/ui/components/admin/database/AdminDatabaseMenu';

const AdminDatabasePage: React.FC = () => (
  <div id="admin-database-page">
    <AdminPageMenu />
    <Grid container stackable>
      <Grid.Column width={3}>
        <AdminDatabaseMenu />
      </Grid.Column>

      <Grid.Column width={13}>
        <Message floating>Click on a page in the menu to the left.</Message>
      </Grid.Column>
    </Grid>
  </div>
);

export default AdminDatabasePage;
