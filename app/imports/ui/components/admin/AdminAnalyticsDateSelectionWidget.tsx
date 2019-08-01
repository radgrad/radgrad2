import * as React from 'react';
import { Form, Segment, Header, Container } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { connect } from 'react-redux';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { ReduxState } from '../../../redux/store'; // eslint-disable-line
import { ANALYTICS } from '../../../startup/client/routes-config';
import { analyticsActions } from '../../../redux/admin/analytics';

interface IAdminAnalyticsDateSelectionWidgetProps {
  page: string;
  setOverheadAnalysisStartDate: (startDate: Date) => any;
  setOverheadAnalysisEndDate: (endDate: Date) => any;
  setStudentSummaryStartDate: (startDate: Date) => any;
  setStudentSummaryEndDate: (endDate: Date) => any;
}

interface IAdminAnalyticsDateSelectionWidgetState {
  startDate: Date,
  endDate: Date,
}

const mapDispatchToProps = (dispatch: any): object => ({
  setOverheadAnalysisStartDate: (startDate: Date) => dispatch(analyticsActions.setOverheadAnalysisStartDate(startDate)),
  setOverheadAnalysisEndDate: (endDate: Date) => dispatch(analyticsActions.setOverheadAnalysisEndDate(endDate)),
  setStudentSummaryStartDate: (startDate: Date) => dispatch(analyticsActions.setStudentSummaryStartDate(startDate)),
  setStudentSummaryEndDate: (endDate: Date) => dispatch(analyticsActions.setStudentSummaryEndDate(endDate)),
});

class AdminAnalyticsDateSelectionWidget extends React.Component<IAdminAnalyticsDateSelectionWidgetProps, IAdminAnalyticsDateSelectionWidgetState> {
  constructor(props) {
    super(props);
    this.state = {
      startDate: undefined,
      endDate: undefined,
    };
  }

  private handleChangeStartDate = (startDate: Date) => this.setState({ startDate: startDate });

  private handleChangeEndDate = (endDate: Date) => this.setState({ endDate: endDate });

  private handleSubmit = (e): void => {
    e.preventDefault();
    const { startDate, endDate } = this.state;
    if (startDate === undefined) {
      Swal.fire({
        title: 'Start Date Required',
        text: 'You must pick a date for the Start Date',
        type: 'error',
      });
      return;
    }
    // End Date is not required, we default it to current date.
    if (endDate === undefined) {
      this.setState({ endDate: moment().toDate() });
    }
    switch (this.props.page) {
      case ANALYTICS.OVERHEADANALYSIS:
        this.props.setOverheadAnalysisStartDate(startDate);
        this.props.setOverheadAnalysisEndDate(endDate);
        break;
      case ANALYTICS.STUDENTSUMMARY:
        this.props.setStudentSummaryStartDate(startDate);
        this.props.setStudentSummaryEndDate(endDate);
        break;
      default:
        break;
    }
  }

  public render() {
    const { startDate, endDate } = this.state;
    return (
      <Container>
        <Segment padded={true}>
          <Header dividing as='h4'>SELECT DATE RANGE:</Header>
          <Form>
            <Form.Group>
              <Form.Input label='Start Date' required>
                <DatePicker
                  onChange={this.handleChangeStartDate}
                  selected={startDate}
                  maxDate={endDate}
                />
              </Form.Input>
              <Form.Input label='End Date' required>
                <DatePicker
                  onChange={this.handleChangeEndDate}
                  selected={endDate}
                  minDate={startDate}/>
              </Form.Input>
            </Form.Group>
            <Form.Button basic={true} color='green' onClick={this.handleSubmit}>Search</Form.Button>
          </Form>
        </Segment>
      </Container>
    );
  }
}

export default connect(null, mapDispatchToProps)(AdminAnalyticsDateSelectionWidget);
