import React from 'react';
import AdminAnalyticsOverheadAnalysisWidget from '../../components/admin/analytics/overhead-analysis/AdminAnalyticsOverheadAnalysisWidget';
import PageLayout from '../PageLayout';

const AdminAnalyticsOverheadAnalysisPage: React.FC = () => (
  <PageLayout id="analytics-overhead-analysis-page" headerPaneTitle="Overhead Analysis">
    <AdminAnalyticsOverheadAnalysisWidget/>
  </PageLayout>
);

export default AdminAnalyticsOverheadAnalysisPage;
