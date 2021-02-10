import React from 'react';
import { Grid } from 'semantic-ui-react';
import AdminPageMenu from '../../components/admin/AdminPageMenu';
import AdminAnalyticsMenuWidget from '../../components/admin/analytics/AdminAnalyticsMenuWidget';
import AdminAnalyticsNewsletterWidget from '../../components/admin/analytics/newsletter/AdminAnalyticsNewsletterWidget';

const AdminAnalyticsNewsletterPage: React.FC = () => {
  // console.log(currentUser, iconName);
  const paddedStyle = {
    paddingTop: 20,
  };
  return (
    <div>
      <AdminPageMenu />
      <Grid container stackable style={paddedStyle} columns={1}>
        <Grid.Column>
          <Grid>
            <Grid.Column width={3}>
              <AdminAnalyticsMenuWidget />
            </Grid.Column>
            <Grid.Column width={13}>
              <AdminAnalyticsNewsletterWidget />
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default AdminAnalyticsNewsletterPage;
