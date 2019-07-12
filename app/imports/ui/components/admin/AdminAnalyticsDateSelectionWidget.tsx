import * as React from 'react';
import { Form, Segment, Button, Header } from 'semantic-ui-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface IAdminAnalyticsDateSelectionWidgetProps {

}

interface IAdminAnalyticsDateSelectionWidgetState {
  startDate: any,
  endDate: any,
  submittedStartDate: any,
  submittedEndDate: any,
  renderOverheadAnalysis: boolean,
}

class AdminAnalyticsDateSelectionWidget extends React.Component<IAdminAnalyticsDateSelectionWidgetProps, IAdminAnalyticsDateSelectionWidgetState> {
  constructor(props) {
    super(props);
    this.state = {
      startDate: '',
      endDate: '',
      submittedStartDate: '',
      submittedEndDate: '',
      renderOverheadAnalysis: false,
    }
  }

  private handleChangeStart = (date) => {
    this.setState({ startDate: date })
  }
  private handleChangeEnd = (date) => {
    this.setState({ endDate: date })
  }
  private handleOnClick = () => {
    this.setState({ submittedStartDate: this.state.startDate, submittedEndDate: this.state.endDate, renderOverheadAnalysis: true}, () =>
      console.log('handle on click state',this.state))
  }

  public render() {
    return (
      <div>
        <Segment>
          <Header dividing as='h4'>SELECT DATE RANGE: </Header>
          <Form>
            <Form.Group>
              <Form.Input label='Start Date' required>
                <DatePicker onChange={this.handleChangeStart} selected={this.state.startDate}/>
              </Form.Input>
              <Form.Input label='End Date' required>
                <DatePicker onChange={this.handleChangeEnd} selected={this.state.endDate}/>
              </Form.Input>
            </Form.Group>
            <Button onClick={this.handleOnClick} basic color='green'>Submit</Button>
          </Form>
        </Segment>
      </div>
    )
  }
}

export default AdminAnalyticsDateSelectionWidget;

// tomorrow, implement redux. want to track the state of the date selection widget in the overhead analysis widget
