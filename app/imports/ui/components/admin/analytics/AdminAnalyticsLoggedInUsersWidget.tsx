import React from 'react';
import { Segment, Header, Grid, Label } from 'semantic-ui-react';
import { Users } from '../../../../api/user/UserCollection';

export interface IAdminAnalyticsLoggedInUsersWidget {
  loggedInUsers: { status: { idle: boolean }, _id: string }[];
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

export default AdminAnalyticsLoggedInUsersWidget;
