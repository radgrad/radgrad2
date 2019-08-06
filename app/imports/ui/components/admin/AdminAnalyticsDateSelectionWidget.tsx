import * as React from 'react';
import { Container, Form, Header, Segment } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { connect } from 'react-redux';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { ANALYTICS } from '../../../startup/client/routes-config';
import { analyticsActions } from '../../../redux/admin/analytics';
import { userInteractionFindMethod } from '../../../api/analytic/UserInteractionCollection.methods';

interface IAdminAnalyticsDateSelectionWidgetProps {
  page: string;
  setOverheadAnalysisStartDate: (startDate: Date) => any;
  setOverheadAnalysisEndDate: (endDate: Date) => any;
  setOverheadBuckets: (overheadBuckets: any[]) => any;
  setUserInteractions: (userInteractions: _.Dictionary<any[]>) => any;
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
  setOverheadBuckets: (overheadBuckets: any[]) => dispatch(analyticsActions.setOverheadBuckets(overheadBuckets)),
  setUserInteractions: (userInteractions: _.Dictionary<any[]>) => dispatch(analyticsActions.setUserInteractions(userInteractions)),
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
    const startDateFormatted = moment(startDate, 'MMMM D, YYYY').toDate();
    const endDateFormatted = moment(endDate, 'MMMM D, YYYY').endOf('day').toDate();
    switch (this.props.page) {
      case ANALYTICS.OVERHEADANALYSIS:
        this.props.setOverheadAnalysisStartDate(startDateFormatted);
        this.props.setOverheadAnalysisEndDate(endDateFormatted);
        break;
      case ANALYTICS.STUDENTSUMMARY:
        this.props.setStudentSummaryStartDate(startDateFormatted);
        this.props.setStudentSummaryEndDate(endDateFormatted);
        break;
      default:
        break;
    }
    // TODO: set DateRange
    const selector = { timestamp: { $gte: startDate, $lte: endDate } };
    const options = { sort: { username: 1, timestamp: 1 } };
    userInteractionFindMethod.call({ selector, options }, (error, result) => {
      if (error) {
        Swal.fire({
          title: 'Failed to Find User Interactions',
          text: error.message,
          type: 'error',
        });
      } else {
        const timeGroups = _.groupBy(result, function (interaction) {
          return moment(interaction.timestamp).utc().format('MMDDYYYYHHmm');
        });
        const docsPerMinGroups = _.groupBy(timeGroups, function (time) {
          return time.length;
        });
        console.log('docsPerMinGroups %o', docsPerMinGroups);
        // const overheadBuckets = this.createBucket(docsPerMinGroups);
        // this.props.setOverheadBuckets(overheadBuckets);
        const userInteractions = _.groupBy(result, 'username');
        console.log('userInteractions %o', userInteractions);
        this.props.setUserInteractions(userInteractions);
        const overheadData = [];
        _.each(userInteractions, (interactions, username) => {
          const sessions = [];
          let totalTime = 0;
          let slicedIndex = 0;
          const userData = {
            username,
            'num-sessions': 1,
            'num-docs': interactions.length,
            'docs-per-min': 0,
            'total-time': 0,
          };
          _.each(interactions, (interaction, index) => {
            if (index !== 0) {
              const prevTimestamp = moment(new Date(interactions[index - 1].timestamp));
              const timestamp = moment(new Date(interaction.timestamp));
              const difference = moment.duration(timestamp.diff(prevTimestamp)).asMinutes();
              const gap = 10;
              if (difference >= gap) {
                sessions.push(_.slice(interactions, slicedIndex, index));
                slicedIndex = index;
                userData['num-sessions']++;
              }
              if (index === interactions.length - 1) {
                sessions.push(_.slice(interactions, slicedIndex));
              }
            }
          });
          _.each(sessions, (session) => {
            const firstTimestamp = moment(new Date(session[0].timestamp));
            const lastTimestamp = moment(new Date(session[session.length - 1].timestamp));
            let difference = Math.ceil(moment.duration(lastTimestamp.diff(firstTimestamp)).asMinutes());
            if (difference === 0) {
              difference = 1;
            }
            totalTime += difference;
          });
          userData['docs-per-min'] = parseFloat((userData['num-docs'] / totalTime).toFixed(2));
          userData['total-time'] = totalTime;
          overheadData.push(userData);
        });
      }
    });
  }

  // private createBucket = (groups) => {
  //   let buckets = [];
  //   _.each(groups, (group, docsPerMin) => {
  //     const bucket = (docsPerMin - (docsPerMin % 10)) / 10;
  //     if (!buckets[bucket]) {
  //       buckets[bucket] = 0;
  //     }
  //     buckets[bucket] += group.length;
  //   });
  //   buckets = _.map(buckets, (value) => {
  //     if (value) {
  //       return value;
  //     }
  //     return 0;
  //   });
  //   return buckets;
  // }

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
