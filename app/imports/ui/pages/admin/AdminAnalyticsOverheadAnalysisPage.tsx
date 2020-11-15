import React from 'react';
import { Grid } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminAnalyticsMenuWidget from '../../components/admin/analytics/AdminAnalyticsMenuWidget';
import AdminAnalyticsOverheadAnalysisWidget
  from '../../components/admin/analytics/overhead-analysis-page/AdminAnalyticsOverheadAnalysisWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import withInstanceSubscriptions from '../../layouts/utilities/InstanceSubscriptionsHOC';

const AdminAnalyticsOverheadAnalysisPage = () => (
  <div>
    <AdminPageMenuWidget />
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={3}>
          <AdminAnalyticsMenuWidget />
        </Grid.Column>

        <Grid.Column width={11}>
          <AdminAnalyticsOverheadAnalysisWidget />
        </Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>
    </Grid>

    <BackToTopButton />
  </div>
);

export default withInstanceSubscriptions(AdminAnalyticsOverheadAnalysisPage);
