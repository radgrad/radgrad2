import * as React from 'react';
import { withRouter } from 'react-router-dom';

interface IAdminAnalyticsMenuWidget{

}

class AdminAnalyticsMenuWidget extends React.Component<IAdminAnalyticsMenuWidget>{
  constructor(props){
    super(props)
    console.log('Admin Analytics Menu Widget props constructor', props)
  }

  public render(){
    console.log('Admin Analytics Menu Widget props', this.props);
    return(
      <div>Admin Analytics Menu Widget </div>
    )
  }
}
export default withRouter(AdminAnalyticsMenuWidget);
