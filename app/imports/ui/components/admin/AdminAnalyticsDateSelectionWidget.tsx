import * as React from 'react';
import { Form, Segment, Button, Header } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { connect } from 'react-redux';
import { ReduxState } from '../../../redux/store'; // eslint-disable-line
import { ANALYTICS } from '../../../startup/client/routes-config';
import { analyticsActions } from '../../../redux/admin/analytics';
import {
  SET_OVERHEAD_ANALYSIS_END_DATE,
  SET_OVERHEAD_ANALYSIS_START_DATE, SET_STUDENT_SUMMARY_END_DATE,
  SET_STUDENT_SUMMARY_START_DATE,
} from '../../../redux/admin/analytics/types';

interface IAdminAnalyticsDateSelectionWidgetProps {
  startDate: any,
  endDate: any,
  page: string;
  setDatePickerStartDate: (type: string, startDate: any) => any;
  setDatePickerEndDate: (type: string, endDate: any) => any;
}

const mapStateToProps = (state: ReduxState): object => {
  switch (this.props.page) {
    case ANALYTICS.OVERHEADANALYSIS:
      return {
        startDate: state.admin.analytics.overheadAnalysis.startDate,
        endDate: state.admin.analytics.overheadAnalysis.endDate,
      };
    case ANALYTICS.STUDENTSUMMARY:
      return {
        startDate: state.admin.analytics.studentSummary.startDate,
        endDate: state.admin.analytics.studentSummary.endDate,
      };
    default:
      return {};
  }
};

const mapDispatchToProps = (dispatch: any): object => ({
  setDatePickerStartDate: (type: string, startDate: any) => dispatch(analyticsActions.setDatePickerStartDate(type, startDate)),
  setDatePickerEndDate: (type: string, endDate: any) => dispatch(analyticsActions.setDatePickerEndDate(type, endDate)),
});

class AdminAnalyticsDateSelectionWidget extends React.Component<IAdminAnalyticsDateSelectionWidgetProps> {
  constructor(props) {
    super(props);
    console.log('props from AdminAnalyicsDateSelectionWidget: ', props);
  }

  private handleChangeStart = (date) => {
    // e.preventDefault();
    console.log('handle change start ', date, typeof date);
    switch (this.props.page) {
      case ANALYTICS.OVERHEADANALYSIS:
        this.props.setDatePickerStartDate(SET_OVERHEAD_ANALYSIS_START_DATE, date);
        break;
      case ANALYTICS.STUDENTSUMMARY:
        this.props.setDatePickerStartDate(SET_STUDENT_SUMMARY_START_DATE, date);
        break;
      default:
        break;
    }
  }

  private handleChangeEnd = (date) => {
    console.log('handle change end ', date, typeof date);
    switch (this.props.page) {
      case ANALYTICS.OVERHEADANALYSIS:
        this.props.setDatePickerEndDate(SET_OVERHEAD_ANALYSIS_END_DATE, date);
        break;
      case ANALYTICS.STUDENTSUMMARY:
        this.props.setDatePickerEndDate(SET_STUDENT_SUMMARY_END_DATE, date);
        break;
      default:
        break;
    }
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
    );
  }
}

const AdminAnalyticsDateSelectionWidgetCon = connect(mapStateToProps, mapDispatchToProps)(AdminAnalyticsDateSelectionWidget);

export default (AdminAnalyticsDateSelectionWidgetCon);


// tomorrow, implement redux. want to track the state of the date selection widget in the overhead analysis widget
