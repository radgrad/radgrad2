import React from 'react';
import { Segment, Header, Grid, Label } from 'semantic-ui-react';
import { Users } from '../../../../api/user/UserCollection';
import { COLORS } from '../../../utilities/Colors';

export interface AdminAnalyticsLoggedInUsersWidgetProps {
  loggedInUsers: { status: { idle: boolean }; _id: string }[];
}

const AdminAnalyticsLoggedInUsersWidget: React.FC<AdminAnalyticsLoggedInUsersWidgetProps> = ({ loggedInUsers }) => (
  <Segment>
    <Header as="h4" dividing>
      LOGGED IN USERS
    </Header>
    <Grid padded stackable>
      <Label.Group>
        {loggedInUsers.map((user) => {
          let color;
          if (user.status.idle) {
            color = COLORS.GREY;
          } else {
            color = COLORS.GREEN;
          }
          return (
            <Label key={user._id} basic color={color}>
              {Users.getFullName(user._id)}
            </Label>
          );
        })}
      </Label.Group>
    </Grid>
  </Segment>
);

export default AdminAnalyticsLoggedInUsersWidget;
