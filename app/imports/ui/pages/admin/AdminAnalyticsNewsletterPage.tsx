import React from 'react';
import { Grid } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminAnalyticsMenuWidget from '../../components/admin/analytics/AdminAnalyticsMenuWidget';
import AdminAnalyticsNewsletterWidget
  from '../../components/admin/analytics/newsletter/AdminAnalyticsNewsletterWidget';
import withInstanceSubscriptions from '../../layouts/utilities/InstanceSubscriptionsHOC';

// TODO: Add a help panel to explain how to use this widget.
const AdminAnalyticsNewsletterPage: React.FC = () => {
  // console.log(currentUser, iconName);
  // TODO: typos React.CSSProperties
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
              <AdminAnalyticsNewsletterWidget />
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    </div>
  );
};

// TODO: All admin-protected routes are already wrapped withInstance subscriptions in App.jsx.
// Remove this.
export default withInstanceSubscriptions(AdminAnalyticsNewsletterPage);
