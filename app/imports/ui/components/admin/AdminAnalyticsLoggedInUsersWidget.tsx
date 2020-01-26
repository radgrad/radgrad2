import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { Segment, Header, Grid, Label } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { Users } from '../../../api/user/UserCollection';

interface IAdminAnalyticsLoggedInUsersWidget {
  loggedInUsers: any;
}

const AdminAnalyticsLoggedInUsersWidget = (props: IAdminAnalyticsLoggedInUsersWidget) => {
  const style = {
    padding: 2,
  };
  return (
    <Segment>
      <Header as="h4" dividing>LOGGED IN USERS</Header>
      <Grid padded stackable>
        <Grid.Column width={2} style={style}>
          {props.loggedInUsers.map((user) => {
            // console.log(user);
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
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

const AdminAnalyticsLoggedInUsersWidgetContainer = withTracker(() => ({
  loggedInUsers: Meteor.users.find({ 'status.online': true }).fetch(),
}))(AdminAnalyticsLoggedInUsersWidget);
export default withRouter(AdminAnalyticsLoggedInUsersWidgetContainer);
