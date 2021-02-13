import React from 'react';
import { Grid } from 'semantic-ui-react';
import AdminPageMenu from '../../components/admin/AdminPageMenu';
import AdminAnalyticsMenuWidget from '../../components/admin/analytics/AdminAnalyticsMenuWidget';
import AdminAnalyticsStudentSummaryWidget from '../../components/admin/analytics/student-summary/AdminAnalyticsStudentSummaryWidget';

const AdminAnalyticsStudentSummaryPage: React.FC = () => {
  const paddedStyle = {
    paddingTop: 20,
  };
  return (
    <div id="analytics-student-summary-page">
      <AdminPageMenu />
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

export default AdminAnalyticsStudentSummaryPage;
