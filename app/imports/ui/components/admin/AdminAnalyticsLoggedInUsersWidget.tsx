import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';

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
    return(

     <div>Admin Analytics Logged In Users</div>
    )
  }
}
const AdminAnalyticsLoggedInUsersWidgetContainer = withTracker( ()=> ({
  loggedInUsers: Meteor.user()
}))(AdminAnalyticsLoggedInUsersWidget);
export default withRouter(AdminAnalyticsLoggedInUsersWidgetContainer);
