import React from 'react';
import AdminAnalyticsStudentSummaryWidget
  from '../../components/admin/analytics/student-summary/AdminAnalyticsStudentSummaryWidget';
import PageLayout from '../PageLayout';

const AdminAnalyticsStudentSummaryPage: React.FC = () => (
  <PageLayout id="analytics-student-summary-page" headerPaneTitle="Student Summary">
    <AdminAnalyticsStudentSummaryWidget/>
  </PageLayout>
);

export default AdminAnalyticsStudentSummaryPage;
