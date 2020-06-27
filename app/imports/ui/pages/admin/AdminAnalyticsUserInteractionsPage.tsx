import React from 'react';
import { Grid } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminAnalyticsMenuWidget from '../../components/admin/AdminAnalyticsMenuWidget';
import AdminAnalyticsUserInteractionsWidget from '../../components/admin/AnalyticsUserInteractionsPage/AdminAnalyticsUserInteractionsWidget';
/** A simple static component to render some text for the landing page. */

class AdminAnalyticsUserInteractionsPage extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
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
                <AdminAnalyticsUserInteractionsWidget />
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default AdminAnalyticsUserInteractionsPage;
