import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { Segment, Header, Grid, Label } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { Users } from '../../../api/user/UserCollection';

interface IAdminAnalyticsLoggedInUsersWidget {
  loggedInUsers: any;
}

const AdminAnalyticsLoggedInUsersWidget = (props: IAdminAnalyticsLoggedInUsersWidget) => (
  <Segment>
    <Header as="h4" dividing>LOGGED IN USERS</Header>
    <Grid>
      <Grid.Column>
        <Label.Group>
          {props.loggedInUsers.map((users) => (
            <Label key={users._id} basic color="green">{Users.getFullName(users._id)}</Label>
          ))}
        </Label.Group>
      </Grid.Column>
    </Grid>
  </Segment>
);

const AdminAnalyticsLoggedInUsersWidgetContainer = withTracker(() => ({
  loggedInUsers: Meteor.users.find({ 'status.online': true }).fetch(),
}))(AdminAnalyticsLoggedInUsersWidget);
export default withRouter(AdminAnalyticsLoggedInUsersWidgetContainer);
