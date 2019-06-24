import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Header} from 'semantic-ui-react';
interface IAdminAnalyticsStudentSummary{

}
class AdminAnalyticsStudentSummaryWidget extends React.Component<IAdminAnalyticsStudentSummary>{
  constructor(props){
    super(props)
  }

  public render(){
    return(
      <div>
        <Segment>
          <Header as='h4' dividing>SUMMARY STATISTICS</Header>
        </Segment>
      </div>
    )
  }
}
export default withRouter(AdminAnalyticsStudentSummaryWidget);
