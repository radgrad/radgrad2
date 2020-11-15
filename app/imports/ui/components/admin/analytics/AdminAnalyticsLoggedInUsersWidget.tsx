import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { Segment, Header, Grid, Label } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { Users } from '../../../../api/user/UserCollection';

interface IAdminAnalyticsLoggedInUsersWidget {
  loggedInUsers: any;
}

const AdminAnalyticsLoggedInUsersWidget = (props: IAdminAnalyticsLoggedInUsersWidget) => (
  <Segment>
    <Header as="h4" dividing>LOGGED IN USERS</Header>
    <Grid padded stackable>
      <Label.Group>
        {props.loggedInUsers.map((user) => {
          let color;
          if (user.status.idle) {
            color = 'grey';
          } else {
            color = 'green';
          }
          return (
            <Label key={user._id} basic color={color}>{Users.getFullName(user._id)}</Label>
          );
        })}
      </Label.Group>
    </Grid>
  </Segment>
);

const AdminAnalyticsLoggedInUsersWidgetContainer = withTracker(() => ({
  loggedInUsers: Meteor.users.find({ 'status.online': true }).fetch(),
}))(AdminAnalyticsLoggedInUsersWidget);
export default withRouter(AdminAnalyticsLoggedInUsersWidgetContainer);
