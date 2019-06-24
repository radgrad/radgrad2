import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Menu } from 'semantic-ui-react';

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
      <div>
        <Menu text vertical>
          <Menu.Item name='Logged In Users'/>
          <Menu.Item name='Newsletter'/>
          <Menu.Item name='Overhead Analysis'/>
          <Menu.Item name='Student Summary'/>
          <Menu.Item name='User Interactions'/>
        </Menu>
      </div>
    )
  }
}
export default withRouter(AdminAnalyticsMenuWidget);
