import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { Segment, Header, Grid, Label } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';

interface IAdminAnalyticsLoggedInUsersWidget {
  loggedInUsers: any;
}

class AdminAnalyticsLoggedInUsersWidget extends React.Component <IAdminAnalyticsLoggedInUsersWidget>{
  constructor(props){
    super(props)
  console.log('Admin Analytics Logged In Users Widget Props Constructor',props);
  }

  public render(){
    console.log('Admin Analytics Logged In Users Widget Props Constructor',this.props);
    console.log(this.props.loggedInUsers);
    return(
     <Segment>
       <Header as='h4' dividing>LOGGED IN USERS</Header>
       <Grid>
         <Label.Group>
           { this.props.loggedInUsers.map((users, index)=>
             <Label key={index}>{users.username}<br/>{users.role}</Label>)
           }
         </Label.Group>
       </Grid>
     </Segment>
    )
  }
}
const AdminAnalyticsLoggedInUsersWidgetContainer = withTracker( ()=> ({
  loggedInUsers: Meteor.users.find().fetch()
}))(AdminAnalyticsLoggedInUsersWidget);
export default withRouter(AdminAnalyticsLoggedInUsersWidgetContainer);
