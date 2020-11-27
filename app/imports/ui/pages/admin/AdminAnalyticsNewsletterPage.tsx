import React from 'react';
import { Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { IFirstMenuProps } from '../../components/shared/FirstMenu';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminAnalyticsMenuWidget from '../../components/admin/analytics/AdminAnalyticsMenuWidget';
import AdminAnalyticsNewsletterWidget
  from '../../components/admin/analytics/newsletter/AdminAnalyticsNewsletterWidget';
import withInstanceSubscriptions from '../../layouts/utilities/InstanceSubscriptionsHOC';

const AdminAnalyticsNewsletterPage: React.FunctionComponent<IFirstMenuProps> = ({ currentUser, iconName }) => {
  const paddedStyle = {
    paddingTop: 20,
  };
  return (
    <div>
      <AdminPageMenuWidget currentUser={currentUser} iconName={iconName} />
      <Grid container stackable style={paddedStyle} columns={1}>
        <Grid.Column>
          <Grid>
            <Grid.Column width={3}>
              <AdminAnalyticsMenuWidget />
            </Grid.Column>
            <Grid.Column width={13}>
              <AdminAnalyticsNewsletterWidget />
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    </div>
  );
};
const AdminAnalyticsNewletterPageContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
  iconName: (Roles.userIsInRole(Meteor.userId(), ['ADMIN'])) ? 'user plus' : 'user',
}))(AdminAnalyticsNewsletterPage);

export default withInstanceSubscriptions(AdminAnalyticsNewletterPageContainer);
