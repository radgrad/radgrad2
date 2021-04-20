import React from 'react';
import AdminAnalyticsNewsletterWidget from '../../components/admin/analytics/newsletter/AdminAnalyticsNewsletterWidget';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

const AdminAnalyticsNewsletterPage: React.FC = () => (
  <PageLayout id={PAGEIDS.ANALYTICS_NEWSLETTER} headerPaneTitle="Newsletter">
    <AdminAnalyticsNewsletterWidget/>
  </PageLayout>
);

export default AdminAnalyticsNewsletterPage;
