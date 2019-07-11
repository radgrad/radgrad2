import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Header } from 'semantic-ui-react';
import DatePicker from 'react-datepicker'; // https://www.npmjs.com/package/react-datepicker

interface IAdminAnalyticsOverheadAnalysisWidgetState {
  startDate: any,
  endDate: any

}

interface AdminAnalyticsOverheadAnalysisWidgetProps {

}


class AdminAnalyticsOverheadAnalysisWidget extends React.Component<IAdminAnalyticsOverheadAnalysisWidgetState, AdminAnalyticsOverheadAnalysisWidgetProps> {
  constructor(props) {
    super(props);
    this.state = {
      startDate: 'start',
      endDate: '',
    }
    console.log('Admin Analytics Overhead Analysis Props constructor',this.props, this.state)
  }

  private handleChange = (event, something) => {
    console.log('handle change',event, something);
    this.setState({startDate: something})

  }
  public render() {

    return (


      <div>
        <Segment>
          <Header as='h4' dividing>Select Date Range</Header>
          <DatePicker onDateChange={this.handleChange} selected={this.props}/>
        </Segment>
        <Segment>

        </Segment>
      </div>
    );
  }
}

export default withRouter(AdminAnalyticsOverheadAnalysisWidget);
