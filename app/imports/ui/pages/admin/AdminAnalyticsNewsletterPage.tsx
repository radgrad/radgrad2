import React from 'react';
import AdminAnalyticsNewsletterWidget from '../../components/admin/analytics/newsletter/AdminAnalyticsNewsletterWidget';
import PageLayout from '../PageLayout';

const AdminAnalyticsNewsletterPage: React.FC = () => (
  <PageLayout id="analytics-newsletter-page" headerPaneTitle="Newsletter">
    <AdminAnalyticsNewsletterWidget/>
  </PageLayout>
);

export default AdminAnalyticsNewsletterPage;
