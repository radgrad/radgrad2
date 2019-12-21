import * as React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDatabaseMenuContainer from '../../components/admin/AdminDatabaseMenu';

const AdminDatabasePage = () => {
  const paddedStyle = {
    paddingTop: 20,
  };
  return (
    <div>
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>

        <Grid.Column width={5}>
          <AdminDatabaseMenuContainer />
        </Grid.Column>

        <Grid.Column width={11}>
          <Message floating>
            Click on a page in the menu to the left.
          </Message>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default AdminDatabasePage;
