import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminAnalyticsMenuWidget from '../../components/admin/AdminAnalyticsMenuWidget';
import AdminAnalyticsOverheadAnalysisOverallWidget from '../../components/admin/AdminAnalyticsOverheadAnalysisOverallWidget';
/** A simple static component to render some text for the landing page. */

class AdminAnalyticsOverheadAnalysisPage extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    const paddedStyle = {
      paddingTop: 20,
    };
    return (
      <div>
        <AdminPageMenuWidget/>
        <Grid container={true} stackable={true} style={paddedStyle} columns={1}>
          <Grid.Column>
            <Grid>
              <Grid.Column width={3}>
                <AdminAnalyticsMenuWidget/>
              </Grid.Column>
              <Grid.Column width={13}>
                <AdminAnalyticsOverheadAnalysisOverallWidget/>
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default AdminAnalyticsOverheadAnalysisPage;
