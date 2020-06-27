import React from 'react';
import { Button, Grid } from 'semantic-ui-react';
import * as _ from 'lodash';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminAnalyticsMenuWidget from '../../components/admin/AdminAnalyticsMenuWidget';
import AdminAnalyticsStudentSummaryWidget from '../../components/admin/AnalyticsStudentSummaryPage/AdminAnalyticsStudentSummaryWidget';
import { userInteractionFindMethod } from '../../../api/analytic/UserInteractionCollection.methods';

const handleClick = (e) => {
  e.preventDefault();
  userInteractionFindMethod.call({}, (error, result) => {
    const userInteractions = _.groupBy(result, 'username');
    console.log('userInteractions %o', userInteractions);
  });
};

const AdminAnalyticsStudentSummaryPage = () => {
  const paddedStyle = {
    paddingTop: 20,
  };
  return (
    <div>
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle} columns={1}>
        <Grid.Column>
          {/* TODO: remove after done with issue-146 */}
          <Button onClick={handleClick}>Interactions</Button>
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
