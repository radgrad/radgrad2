import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminAnalyticsMenuWidget from '../../components/admin/analytics/AdminAnalyticsMenuWidget';
import AdminAnalyticsLoggedInUsersWidget, { AdminAnalyticsLoggedInUsersWidgetProps } from '../../components/admin/analytics/AdminAnalyticsLoggedInUsersWidget';

const AdminAnalyticsPage: React.FC<AdminAnalyticsLoggedInUsersWidgetProps> = ({ loggedInUsers }) => (
  <div id="admin-analytics-page">
    <AdminPageMenuWidget />
    <Grid container stackable columns={1}>
      <Grid.Column>
        <Grid>
          <Grid.Column width={3}>
            <AdminAnalyticsMenuWidget />
          </Grid.Column>
          <Grid.Column width={13}>
            <AdminAnalyticsLoggedInUsersWidget loggedInUsers={loggedInUsers} />
          </Grid.Column>
        </Grid>
      </Grid.Column>
    </Grid>
  </div>
);

export default withTracker(() => ({
  loggedInUsers: Meteor.users.find({ 'status.online': true }).fetch(),
}))(AdminAnalyticsPage);
