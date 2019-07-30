import * as React from 'react';
import { Form, Segment, Button, Header } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { connect } from 'react-redux';
import { ReduxState } from '../../../redux/store'; // eslint-disable-line
import { ANALYTICS } from '../../../startup/client/routes-config';
import { analyticsActions } from '../../../redux/admin/analytics';

interface IAdminAnalyticsDateSelectionWidgetProps {
  startDate: any,
  endDate: any,
  page: string;
  setOverheadAnalysisStartDate: (startDate: Date) => any;
  setOverheadAnalysisEndDate: (endDate: Date) => any;
  setStudentSummaryStartDate: (startDate: Date) => any;
  setStudentSummaryEndDate: (endDate: Date) => any;
}

const mapStateToProps = (state: ReduxState, props): object => {
  switch (props.page) {
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
  setOverheadAnalysisStartDate: (startDate: Date) => dispatch(analyticsActions.setOverheadAnalysisStartDate(startDate)),
  setOverheadAnalysisEndDate: (endDate: Date) => dispatch(analyticsActions.setOverheadAnalysisEndDate(endDate)),
  setStudentSummaryStartDate: (startDate: Date) => dispatch(analyticsActions.setStudentSummaryStartDate(startDate)),
  setStudentSummaryEndDate: (endDate: Date) => dispatch(analyticsActions.setStudentSummaryEndDate(endDate)),
});

class AdminAnalyticsDateSelectionWidget extends React.Component<IAdminAnalyticsDateSelectionWidgetProps> {
  constructor(props) {
    super(props);
  }

  private dateRange = (): string => ''

  private handleChangeStart = (date: Date) => {
    switch (this.props.page) {
      case ANALYTICS.OVERHEADANALYSIS:
        this.props.setOverheadAnalysisStartDate(date);
        break;
      case ANALYTICS.STUDENTSUMMARY:
        this.props.setStudentSummaryStartDate(date);
        break;
      default:
        break;
    }
  }

  private handleChangeEnd = (date: Date) => {
    switch (this.props.page) {
      case ANALYTICS.OVERHEADANALYSIS:
        this.props.setOverheadAnalysisEndDate(date);
        break;
      case ANALYTICS.STUDENTSUMMARY:
        this.props.setStudentSummaryEndDate(date);
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

export default AdminAnalyticsDateSelectionWidgetCon;


// tomorrow, implement redux. want to track the state of the date selection widget in the overhead analysis widget
