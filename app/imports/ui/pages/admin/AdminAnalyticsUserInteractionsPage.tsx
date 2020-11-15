import React from 'react';
import { Grid } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminAnalyticsMenuWidget from '../../components/admin/analytics/AdminAnalyticsMenuWidget';
import AdminAnalyticsUserInteractionsWidget
  from '../../components/admin/analytics/user-interactions-page/AdminAnalyticsUserInteractionsWidget';
import withInstanceSubscriptions from '../../layouts/utilities/InstanceSubscriptionsHOC';

const AdminAnalyticsUserInteractionsPage = () => {
  const paddedStyle = {
    paddingTop: 20,
  };
  return (
    <div>
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle} columns={1}>
        <Grid.Column>
          <Grid>
            <Grid.Column width={3}>
              <AdminAnalyticsMenuWidget />
            </Grid.Column>
            <Grid.Column width={13}>
              <AdminAnalyticsUserInteractionsWidget />
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default withInstanceSubscriptions(AdminAnalyticsUserInteractionsPage);
