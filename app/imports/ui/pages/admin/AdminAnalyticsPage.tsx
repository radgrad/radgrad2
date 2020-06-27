import React from 'react';
import * as _ from 'lodash';
import { Grid, Button } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminAnalyticsMenuWidget from '../../components/admin/AdminAnalyticsMenuWidget';
import AdminAnalyticsLoggedInUsersWidget from '../../components/admin/AnalyticsPage/AdminAnalyticsLoggedInUsersWidget';
import { userInteractionFindMethod } from '../../../api/analytic/UserInteractionCollection.methods';

const handleClick = (e) => {
  e.preventDefault();
  userInteractionFindMethod.call({}, (error, result) => {
    const userInteractions = _.groupBy(result, 'username');
    console.log('userInteractions %o', userInteractions);
  });
};

const AdminAnalyticsPage = () => (
  <div>
    <AdminPageMenuWidget />
    {/* TODO: remove after done with issue-146 */}
    <Grid container stackable columns={1}>
      <Grid.Column>
        <Button onClick={handleClick}>Interactions</Button>
        <Grid>
          <Grid.Column width={3}>
            <AdminAnalyticsMenuWidget />
          </Grid.Column>
          <Grid.Column width={13}>
            <AdminAnalyticsLoggedInUsersWidget />
          </Grid.Column>
        </Grid>
      </Grid.Column>
    </Grid>
  </div>
);


export default AdminAnalyticsPage;
