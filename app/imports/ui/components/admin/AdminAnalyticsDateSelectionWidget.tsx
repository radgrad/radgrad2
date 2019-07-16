import * as React from 'react';
import { Form, Segment, Button, Header } from 'semantic-ui-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from 'react-redux';
import { withTracker } from "meteor/react-meteor-data";
import { setDateSelectionWidgetStartDate } from "../../../redux/actions/adminAnalyticsDateSelectionActions";

interface IAdminAnalyticsDateSelectionWidgetProps {
  startDate: any,
  endDate: any,
  dispatch: any,
}

const mapStatetoProps = (state) => ({
  startDate: state.adminAnalyticsOverheadAnalysisPage.adminAnalyticsDateSelectionWidget.startDate,
  endDate: state.adminAnalyticsOverheadAnalysisPage.adminAnalyticsDateSelectionWidget.endDate
});


class AdminAnalyticsDateSelectionWidget extends React.Component<IAdminAnalyticsDateSelectionWidgetProps> {
  constructor(props) {
    super(props);
    console.log('props from AdminAnalyicsDateSelectionWidget: ', props)
  }

  private handleChangeStart = (e: any): any => {
    //e.preventDefault();
    console.log('handle change start', e, typeof e);
    this.props.dispatch(setDateSelectionWidgetStartDate(e));
    console.log(this.props);
  }
  private handleChangeEnd = (date) => {
    this.setState({ endDate: date }, () => {
      console.log('after handle change end', this.state)
    })
  }


  public render() {
    return (
      <div>
        <Segment>
          <Header dividing as='h4'>SELECT DATE RANGE: </Header>
          <Form>
            <Form.Group>
              <Form.Input label='Start Date' required>
                <DatePicker onChange={this.handleChangeStart} selected={this.props.startDate}/>
              </Form.Input>
              <Form.Input label='End Date' required>
                <DatePicker onChange={this.handleChangeEnd} selected={this.props.endDate}/>
              </Form.Input>
            </Form.Group>
            <Button basic color='green'>Submit</Button>
          </Form>
        </Segment>
      </div>
    )
  }
}

const AdminAnalyticsDateSelectionWidgetCon = connect(mapStatetoProps)(AdminAnalyticsDateSelectionWidget);

export default (AdminAnalyticsDateSelectionWidgetCon);


// tomorrow, implement redux. want to track the state of the date selection widget in the overhead analysis widget
