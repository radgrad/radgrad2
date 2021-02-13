import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import AdminAnalyticsOverheadAnalysisWidget from '../../components/admin/analytics/overhead-analysis/AdminAnalyticsOverheadAnalysisWidget';
import { HelpPanelWidgetProps } from '../../components/shared/HelpPanelWidget';
import PageLayout from '../PageLayout';

const AdminAnalyticsOverheadAnalysisPage: React.FC<HelpPanelWidgetProps> = ({ helpMessages }) => (
  <PageLayout id="analytics-overhead-analysis-page" headerPaneTitle="Overhead Analysis">
    <AdminAnalyticsOverheadAnalysisWidget/>
  </PageLayout>
);

export default withTracker(() => {
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    helpMessages,
  };
})(AdminAnalyticsOverheadAnalysisPage);
