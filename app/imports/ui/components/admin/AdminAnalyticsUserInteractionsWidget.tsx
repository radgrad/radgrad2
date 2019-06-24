import * as React from 'react';
import { withRouter } from 'react-router-dom';

interface IAdminAnalyticsUserInteractionsWidget{

}
class AdminAnalyticsUserInteractionsWidget extends React.Component<IAdminAnalyticsUserInteractionsWidget>{
  constructor(props){
    super(props)
  }
  public render(){
    return(
      <div>Admin Analytics User Interactions Widget</div>
    )
  }
}
export default withRouter(AdminAnalyticsUserInteractionsWidget);
