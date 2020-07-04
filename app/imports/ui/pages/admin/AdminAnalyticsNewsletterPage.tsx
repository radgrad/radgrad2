import React from 'react';
import { Grid } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminAnalyticsMenuWidget from '../../components/admin/AdminAnalyticsMenuWidget';
import AdminAnalyticsNewsletterWidget from '../../components/admin/AnalyticsNewsletterPage/AdminAnalyticsNewsletterWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';

class AdminAnalyticsNewsletterPage extends React.Component {
  public render() {
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
  }
}

export default withInstanceSubscriptions(AdminAnalyticsNewsletterPage);
