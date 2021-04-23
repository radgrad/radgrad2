import React from 'react';
import AdminAnalyticsOverheadAnalysisWidget from '../../components/admin/analytics/overhead-analysis/AdminAnalyticsOverheadAnalysisWidget';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

const AdminAnalyticsOverheadAnalysisPage: React.FC = () => (
  <PageLayout id={PAGEIDS.ANALYTICS_OVERHEAD_ANALYSIS} headerPaneTitle="Overhead Analysis">
    <AdminAnalyticsOverheadAnalysisWidget dateRange={{ startDate: undefined, endDate: undefined }}/>
  </PageLayout>
);

export default AdminAnalyticsOverheadAnalysisPage;
