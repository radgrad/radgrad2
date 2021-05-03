import moment from 'moment';
import React from 'react';
import { Header, Segment, Table } from 'semantic-ui-react';
import { userInteractionFindMethod } from '../../../api/user-interaction/UserInteractionCollection.methods';
import BehaviorAggregates from '../../components/admin/analytics/BehaviorAggregates';
import DateIntervalSelector from '../../components/admin/analytics/DateIntervalSelector';
import { PAGEIDS } from '../../utilities/PageIDs';
import { useStickyState } from '../../utilities/StickyState';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'Student Community Behavior Breakdown';
const headerPaneBody = `
First, select a time interval (defaults to the current day.)

Then, press "Submit" to obtain a breakdown of the behaviors exhibited by students over the time period.

Note that User Interactions are generated for each day around midnight. So, today's user interactions are generally not available.
`;

/** TODO:
 * What are the kinds of UI analyses that we need going forward:
 *   * Aggregate based: get rid of the time:
 *   * Behaviors: Would be good to have a toggle to be select everyone or else select a single user.
 *   * Most active: Number of discrete behaviors found.
 *   * Timeline based:
 *     - Num Behaviors, and Types present on each day in the interval.
 */

const startOf = date => moment(date).startOf('day').toDate();
const startStickyStateID = 'AdminAnalyticsStudentSummaryPage.startDate';
const endStickyStateID = 'AdminAnalyticsStudentSummaryPage.endDate';
const userInteractionsStickyStateID = 'AdminAnalyticsStudentSummaryPage.userInteractions';

const AdminAnalyticsStudentSummaryPage: React.FC = () => {
  const [startDate] = useStickyState(startStickyStateID, startOf(moment().subtract(1, 'days')));
  const [endDate] = useStickyState(endStickyStateID, startOf(moment().add(1, 'days')));
  const [userInteractions, setUserInteractions] = useStickyState(userInteractionsStickyStateID, null);
  const onClick = () => {
    const selector = { timestamp: { $gte: startDate, $lte: endDate } };
    const options = { sort: { username: 1, timestamp: 1 } };
    userInteractionFindMethod.callPromise({ selector, options })
      .catch(error => console.error(error.message))
      .then(results => setUserInteractions(results));
  };
  console.log('userInteractions', userInteractions);
  return (
    <PageLayout id={PAGEIDS.ANALYTICS_STUDENT_SUMMARY} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
      <Segment>
        <Header as="h4" dividing>Select Interval</Header>
        <DateIntervalSelector startStickyStateID={startStickyStateID} endStickyStateID={endStickyStateID} onClick={onClick} />
        { userInteractions && <BehaviorAggregates userInteractions={userInteractions} /> }
      </Segment>
    </PageLayout>
  );
};

export default AdminAnalyticsStudentSummaryPage;
