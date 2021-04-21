import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import AdminAnalyticsUserInteractionsWidget, { AdminAnalyticsUserInteractionsWidgetProps } from '../../components/admin/analytics/user-interactions/AdminAnalyticsUserInteractionsWidget';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

const AdminAnalyticsUserInteractionsPage: React.FC<AdminAnalyticsUserInteractionsWidgetProps> = ({ students }) => (
  <PageLayout id={PAGEIDS.ANALYTICS_USER_INTERACTIONS} headerPaneTitle="User Interactions">
    <AdminAnalyticsUserInteractionsWidget students={students}/>
  </PageLayout>
);

const con = withTracker(() => {
  const students = StudentProfiles.find({ isAlumni: false }).fetch();
  return {
    students,
  };
})(AdminAnalyticsUserInteractionsPage);

export default con;
