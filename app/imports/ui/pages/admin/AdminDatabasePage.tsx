import React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDatabaseMenu, { IAdminDatabaseMenuProps } from '../../components/admin/database/AdminDatabaseMenu';

const AdminDatabasePage = (props: IAdminDatabaseMenuProps) => (
  <div id="admin-database-page">
    <AdminPageMenuWidget />
    <Grid container stackable>

      <Grid.Column width={3}>
        <AdminDatabaseMenu currentUser={props.currentUser} />
      </Grid.Column>

      <Grid.Column width={13}>
        <Message floating>
          Click on a page in the menu to the left.
        </Message>
      </Grid.Column>
    </Grid>
  </div>
);

const AdminDatabasePageContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(AdminDatabasePage);

export default AdminDatabasePageContainer;
