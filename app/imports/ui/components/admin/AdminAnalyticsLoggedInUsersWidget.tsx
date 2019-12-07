import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { Segment, Header, Grid, Label } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { Users } from '../../../api/user/UserCollection';

interface IAdminAnalyticsLoggedInUsersWidget {
  loggedInUsers: any;
}

class AdminAnalyticsLoggedInUsersWidget extends React.Component <IAdminAnalyticsLoggedInUsersWidget> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <Segment>
        <Header as='h4' dividing>LOGGED IN USERS</Header>
        <Grid>
          <Grid.Column>
            <Label.Group>
              {this.props.loggedInUsers.map((users, index) => <Label key={index} basic color='green'>{Users.getFullName(users._id)}</Label>)
              }
            </Label.Group>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

const AdminAnalyticsLoggedInUsersWidgetContainer = withTracker(() => ({
  loggedInUsers: Meteor.users.find({ 'status.online': true }).fetch(),
}))(AdminAnalyticsLoggedInUsersWidget);
export default withRouter(AdminAnalyticsLoggedInUsersWidgetContainer);
