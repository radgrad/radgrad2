import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import AdminAnalyticsLoggedInUsersWidget, { AdminAnalyticsLoggedInUsersWidgetProps } from '../../components/admin/analytics/AdminAnalyticsLoggedInUsersWidget';
import PageLayout from '../PageLayout';

const AdminAnalyticsLoggedInUsersPage: React.FC<AdminAnalyticsLoggedInUsersWidgetProps> = ({ loggedInUsers }) => (
  <PageLayout id="analytics-logged-in-users-page" headerPaneTitle="Logged In Users">
    <AdminAnalyticsLoggedInUsersWidget loggedInUsers={loggedInUsers}/>
  </PageLayout>
);

export default withTracker(() => ({
  loggedInUsers: Meteor.users.find({ 'status.online': true }).fetch(),
}))(AdminAnalyticsLoggedInUsersPage);
