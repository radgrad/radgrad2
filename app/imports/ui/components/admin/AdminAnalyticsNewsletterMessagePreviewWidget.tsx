import * as React from 'react';
import { withRouter } from 'react-router-dom';

interface IAdminAnalyticsNewsletterWidget {
message: string;
}

class AdminAnalyticsNewsletterMessagePreviewWidget extends React.Component<IAdminAnalyticsNewsletterWidget> {
  constructor(props){
    super(props)
    console.log('Admin Analytics Newsletter Message Preview Widget',props)
  }
  public render(){
    return(
      <div>
        <p>Aloha Student! </p>
        <div className='markdown'>
          {this.props.message}
        </div><br/>
        <p>- The RadGrad Team</p>
      </div>
    )
  }
}

export default withRouter(AdminAnalyticsNewsletterMessagePreviewWidget);
