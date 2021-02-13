import React from 'react';
import { Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import AdminPageMenu from '../../components/admin/AdminPageMenu';
import AdminAnalyticsMenuWidget from '../../components/admin/analytics/AdminAnalyticsMenuWidget';
import AdminAnalyticsOverheadAnalysisWidget from '../../components/admin/analytics/overhead-analysis/AdminAnalyticsOverheadAnalysisWidget';
import HelpPanelWidget, { HelpPanelWidgetProps } from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

const AdminAnalyticsOverheadAnalysisPage: React.FC<HelpPanelWidgetProps> = ({ helpMessages }) => (
  <div id="analytics-overhead-analysis-page">
    <AdminPageMenu />
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}>
          <HelpPanelWidget helpMessages={helpMessages} />
        </Grid.Column>
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

export default withTracker(() => {
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    helpMessages,
  };
})(AdminAnalyticsOverheadAnalysisPage);
