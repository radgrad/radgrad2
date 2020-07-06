import React from 'react';
import { Grid } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminAnalyticsMenuWidget from '../../components/admin/AdminAnalyticsMenuWidget';
import AdminAnalyticsStudentSummaryWidget from '../../components/admin/AdminAnalyticsStudentSummaryWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';

/** A simple static component to render some text for the landing page. */
const AdminAnalyticsStudentSummaryPage = () => {
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
              <AdminAnalyticsStudentSummaryWidget />
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default withInstanceSubscriptions(AdminAnalyticsStudentSummaryPage);
