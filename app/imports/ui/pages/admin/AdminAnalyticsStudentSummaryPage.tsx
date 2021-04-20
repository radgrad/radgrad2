import React from 'react';
import AdminAnalyticsStudentSummaryWidget
  from '../../components/admin/analytics/student-summary/AdminAnalyticsStudentSummary';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

const AdminAnalyticsStudentSummaryPage: React.FC = () => (
  <PageLayout id={PAGEIDS.ANALYTICS_STUDENT_SUMMARY} headerPaneTitle="Student Summary">
    <AdminAnalyticsStudentSummaryWidget/>
  </PageLayout>
);

export default AdminAnalyticsStudentSummaryPage;
