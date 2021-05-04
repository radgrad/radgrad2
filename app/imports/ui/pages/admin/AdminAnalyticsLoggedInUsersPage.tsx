import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Label } from 'semantic-ui-react';
import { Users } from '../../../api/user/UserCollection';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

const header = <RadGradHeader title='Logged in Users' />;
const headerPaneTitle = 'Logged in users';
const headerPaneBody = 'Green labels indicate active users, grey labels indicate idle users';

export interface AdminAnalyticsLoggedInUsersProps {
  loggedInUsers: { status: { idle: boolean }; _id: string }[];
}

const AdminAnalyticsLoggedInUsersPage: React.FC<AdminAnalyticsLoggedInUsersProps> = ({ loggedInUsers }) => (
  <PageLayout id={PAGEIDS.ANALYTICS_LOGGED_IN_USERS} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
    <RadGradSegment header={header}>
      <Grid padded stackable>
        <Label.Group>
          {loggedInUsers.map((user) => (
            <Label key={user._id} basic color={(user.status.idle) ? 'grey' : 'green'}>
              {Users.getFullName(user._id)}
            </Label>
          ))}
        </Label.Group>
      </Grid>
    </RadGradSegment>
  </PageLayout>
);

export default withTracker(() => ({
  loggedInUsers: Meteor.users.find({ 'status.online': true }).fetch(),
}))(AdminAnalyticsLoggedInUsersPage);
