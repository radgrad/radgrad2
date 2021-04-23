import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import AdminAnalyticsLoggedInUsersWidget, { AdminAnalyticsLoggedInUsersWidgetProps } from '../../components/admin/analytics/AdminAnalyticsLoggedInUsersWidget';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

const AdminAnalyticsLoggedInUsersPage: React.FC<AdminAnalyticsLoggedInUsersWidgetProps> = ({ loggedInUsers }) => (
  <PageLayout id={PAGEIDS.ANALYTICS_LOGGED_IN_USERS} headerPaneTitle="Logged In Users">
    <AdminAnalyticsLoggedInUsersWidget loggedInUsers={loggedInUsers}/>
  </PageLayout>
);

export default withTracker(() => ({
  loggedInUsers: Meteor.users.find({ 'status.online': true }).fetch(),
}))(AdminAnalyticsLoggedInUsersPage);
