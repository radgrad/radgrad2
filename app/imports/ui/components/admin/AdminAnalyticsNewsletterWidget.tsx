import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Header } from "semantic-ui-react";

interface IAdminAnalyticsNewsletterWidget{

}

class AdminAnalyticsNewsletterWidget extends React.Component<IAdminAnalyticsNewsletterWidget>{
  constructor(props){
    super(props)
  }

  public render(){
    return(
      <div>
        <Segment>
          <Header as='h4' dividing>NEWSLETTER OPTIONS</Header>
        </Segment>
      </div>
    )
  }
}
export default withRouter(AdminAnalyticsNewsletterWidget);
