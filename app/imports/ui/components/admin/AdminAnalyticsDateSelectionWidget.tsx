import React, { useState } from 'react';
import { Container, Form, Header, Segment } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { connect } from 'react-redux';
import moment from 'moment';
import Swal from 'sweetalert2';
import _ from 'lodash';
import { ANALYTICS } from '../../../startup/client/route-constants';
import { analyticsActions } from '../../../redux/admin/analytics';
import { userInteractionFindMethod } from '../../../api/analytic/UserInteractionCollection.methods';

interface IAdminAnalyticsDateSelectionWidgetProps {
  page: string;
  setOverheadAnalysisDateRange: (dateRange: analyticsActions.ISetDateRangeProps) => any;
  setOverheadBuckets: (overheadBuckets: any[]) => any;
  setUserInteractions: (userInteractions: _.Dictionary<any[]>) => any;
  setStudentSummaryDateRange: (dateRange: analyticsActions.ISetDateRangeProps) => any;
  setStudentSummaryUserInteractions: (userInteractions: _.Dictionary<any[]>) => any;
}

const mapDispatchToProps = (dispatch: any): object => ({
  setOverheadAnalysisDateRange: (dateRange: analyticsActions.ISetDateRangeProps) => dispatch(analyticsActions.setOverheadAnalysisDateRange(dateRange)),
  setOverheadBuckets: (overheadBuckets: any[]) => dispatch(analyticsActions.setOverheadBuckets(overheadBuckets)),
  setUserInteractions: (userInteractions: _.Dictionary<any[]>) => dispatch(analyticsActions.setUserInteractions(userInteractions)),
  setStudentSummaryDateRange: (dateRange: analyticsActions.ISetDateRangeProps) => dispatch(analyticsActions.setStudentSummaryDateRange(dateRange)),
  setStudentSummaryUserInteractions: (userInteractions: _.Dictionary<any[]>) => dispatch(analyticsActions.setStudentSummaryUserInteractions(userInteractions)),
});

const AdminAnalyticsDateSelectionWidget = (props: IAdminAnalyticsDateSelectionWidgetProps) => {
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
    switch (props.page) {
      case ANALYTICS.OVERHEADANALYSIS:
        props.setOverheadAnalysisDateRange({ startDate: startDateMutated, endDate: endDateMutated });
        break;
      case ANALYTICS.STUDENTSUMMARY:
        props.setStudentSummaryDateRange({ startDate: startDateMutated, endDate: endDateMutated });
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
        const timeGroups = _.groupBy(result, function (interaction) {
          return moment(interaction.timestamp).utc().format('MMDDYYYYHHmm');
        });
        const docsPerMinGroups = _.groupBy(timeGroups, function (time) {
          return time.length;
        });
        // console.log('docsPerMinGroups ', docsPerMinGroups);
        const overheadBuckets = createBucket(docsPerMinGroups);
        // console.log('overheadBuckets ', overheadBuckets);
        props.setOverheadBuckets(overheadBuckets);
        const userInteractions = _.groupBy(result, 'username');
        // console.log('userInteractions ', userInteractions);
        props.setUserInteractions(userInteractions);
        props.setStudentSummaryUserInteractions(userInteractions);
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
        // console.log('overheadData ', overheadData);
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
        <Header dividing as="h4">SELECT DATE RANGE:</Header>
        <Form>
          <Form.Group>
            <Form.Input label="Start Date" required>
              <DatePicker
                onChange={handleChangeStartDate}
                selected={startDate}
                maxDate={endDate}
              />
            </Form.Input>
            <Form.Input label="End Date" required>
              <DatePicker
                onChange={handleChangeEndDate}
                selected={endDate}
                minDate={startDate}
              />
            </Form.Input>
          </Form.Group>
          <Form.Button basic color="green" onClick={handleSubmit}>Search</Form.Button>
        </Form>
      </Segment>
    </Container>
  );
};

export default connect(null, mapDispatchToProps)(AdminAnalyticsDateSelectionWidget);
