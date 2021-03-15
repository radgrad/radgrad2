import React, { useState } from 'react';
import { Container, Form, Header, Segment } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { connect } from 'react-redux';
import moment from 'moment';
import Swal from 'sweetalert2';
import _ from 'lodash';
import { ANALYTICS } from '../../../layouts/utilities/route-constants';
import { analyticsActions } from '../../../../redux/admin/analytics';
import { userInteractionFindMethod } from '../../../../api/analytic/UserInteractionCollection.methods';
import { IAdminAnalyticsOverheadAnalysisBuckets, AdminAnalyticsOverheadAnalysisData, IAdminAnalyticsUserInteraction } from '../../../../redux/admin/analytics/reducers';

interface AdminAnalyticsDateSelectionWidgetProps {
  page: string;
  setOverheadAnalysisDateRange: (dateRange: analyticsActions.SetDateRangeProps) => any;
  setOverheadAnalysisBuckets: (overheadBuckets: IAdminAnalyticsOverheadAnalysisBuckets) => any;
  setOverheadAnalysisData: (overheadData: AdminAnalyticsOverheadAnalysisData[]) => any;
  setOverheadAnalysisUserInteractions: (userInteractions: IAdminAnalyticsUserInteraction) => any;
  setStudentSummaryDateRange: (dateRange: analyticsActions.SetDateRangeProps) => any;
  setStudentSummaryUserInteractions: (userInteractions: IAdminAnalyticsUserInteraction) => any;
}

const mapDispatchToProps = (dispatch: any): any => ({
  setOverheadAnalysisDateRange: (dateRange: analyticsActions.SetDateRangeProps) => dispatch(analyticsActions.setOverheadAnalysisDateRange(dateRange)),
  setOverheadAnalysisBuckets: (overheadBuckets: IAdminAnalyticsOverheadAnalysisBuckets) => dispatch(analyticsActions.setOverheadAnalysisBuckets(overheadBuckets)),
  setOverheadAnalysisData: (overheadData: AdminAnalyticsOverheadAnalysisData[]) => dispatch(analyticsActions.setOverheadAnalysisData(overheadData)),
  setOverheadAnalysisUserInteractions: (userInteractions: IAdminAnalyticsUserInteraction) => dispatch(analyticsActions.setOverheadAnalysisUserInteractions(userInteractions)),
  setStudentSummaryDateRange: (dateRange: analyticsActions.SetDateRangeProps) => dispatch(analyticsActions.setStudentSummaryDateRange(dateRange)),
  setStudentSummaryUserInteractions: (userInteractions: IAdminAnalyticsUserInteraction) => dispatch(analyticsActions.setStudentSummaryUserInteractions(userInteractions)),
});

const AdminAnalyticsDateSelectionWidget: React.FC<AdminAnalyticsDateSelectionWidgetProps> = ({
  page,
  setOverheadAnalysisBuckets,
  setOverheadAnalysisData,
  setOverheadAnalysisDateRange,
  setOverheadAnalysisUserInteractions,
  setStudentSummaryDateRange,
  setStudentSummaryUserInteractions,
}) => {
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);

  const handleChangeStartDate = (date: Date) => setStartDate(date);

  const handleChangeEndDate = (date: Date) => setEndDate(date);

  const handleSubmit = (e): void => {
    e.preventDefault();
    /* Setting the Date Range */
    if (startDate === undefined || endDate === undefined) {
      Swal.fire({
        title: 'Date Selection Required',
        text: 'A Start and End Date selection is required.',
        icon: 'error',
      });
      return;
    }
    const startDateMutated = moment(startDate).startOf('day').toDate();
    const endDateMutated = moment(endDate).endOf('day').toDate();
    switch (page) {
      case ANALYTICS.OVERHEAD_ANALYSIS:
        setOverheadAnalysisDateRange({ startDate: startDateMutated, endDate: endDateMutated });
        break;
      case ANALYTICS.STUDENT_SUMMARY:
        setStudentSummaryDateRange({ startDate: startDateMutated, endDate: endDateMutated });
        break;
      default:
        break;
    }

    /* Getting Overhead Data */
    const selector = { timestamp: { $gte: startDateMutated, $lte: endDateMutated } };
    const options = { sort: { username: 1, timestamp: 1 } };
    userInteractionFindMethod.call({ selector, options }, (error, result) => {
      if (error) {
        Swal.fire({
          title: 'Failed to Find User Interactions',
          text: error.message,
          icon: 'error',
        });
      } else {
        const timeGroups = _.groupBy(result, (interaction) => moment(interaction.timestamp).utc().format('MMDDYYYYHHmm'));
        const docsPerMinGroups = _.groupBy(timeGroups, (time) => time.length);
        // console.log('docsPerMinGroups ', docsPerMinGroups);
        const overheadBuckets = createBucket(docsPerMinGroups);
        // console.log('overheadBuckets ', overheadBuckets);
        setOverheadAnalysisBuckets(overheadBuckets);
        const userInteractions = _.groupBy(result, 'username');
        console.log('userInteractions ', userInteractions);
        /* Setting User Interactions for Overhead Analysis and Student Summary */
        if (page === ANALYTICS.OVERHEAD_ANALYSIS) {
          setOverheadAnalysisUserInteractions(userInteractions);
        } else if (page === ANALYTICS.STUDENT_SUMMARY) {
          setStudentSummaryUserInteractions(userInteractions);
        }
        /* Generating Overhead Data */
        const overheadData = [];
        _.forEach(userInteractions, (interactions, username) => {
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
          _.forEach(interactions, (interaction, index) => {
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
          _.forEach(sessions, (session) => {
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
        setOverheadAnalysisData(overheadData);
      }
    });
  };

  const createBucket = (groups: { [key: number]: any }): number[] => {
    let buckets = [];
    // iteratee of a foreach is (value, key)
    _.forEach(groups, (group, key) => {
      const docsPerMin: number = parseInt(key, 10);
      const bucket = (docsPerMin - (docsPerMin % 10)) / 10;
      if (!buckets[bucket]) {
        buckets[bucket] = 0;
      }
      buckets[bucket] += group.length;
    });
    buckets = _.map(buckets, (value) => {
      if (value) {
        return value;
      }
      return 0;
    });
    return buckets;
  };

  return (
    <Container>
      <Segment padded>
        <Header dividing as="h4">
          SELECT A DATE PERIOD
        </Header>
        <Form>
          <Form.Group>
            <Form.Input label="Start Date" required>
              <DatePicker onChange={handleChangeStartDate} selected={startDate} maxDate={endDate} />
            </Form.Input>
            <Form.Input label="End Date" required>
              <DatePicker onChange={handleChangeEndDate} selected={endDate} minDate={startDate} />
            </Form.Input>
          </Form.Group>
          <Form.Button basic color="green" onClick={handleSubmit}>
            Search
          </Form.Button>
        </Form>
      </Segment>
    </Container>
  );
};

export default connect(null, mapDispatchToProps)(AdminAnalyticsDateSelectionWidget);
