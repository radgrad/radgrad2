import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminAnalyticsMenuWidget from '../../components/admin/AdminAnalyticsMenuWidget'
import AdminAnalyticsLoggedInUsersWidget from "../../components/admin/AdminAnalyticsLoggedInUsersWidget";
/** A simple static component to render some text for the landing page. */
class AdminAnalyticsPage extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    const paddedStyle = {
      paddingTop: 20,
    };
    return (
      <div>
        <AdminPageMenuWidget/>
        <Grid container={true} stackable={true} style={paddedStyle} columns={2}>
          <Grid.Column>
            <AdminAnalyticsMenuWidget/>
          </Grid.Column>
          <Grid.Column>
            <AdminAnalyticsLoggedInUsersWidget/>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default AdminAnalyticsPage;
