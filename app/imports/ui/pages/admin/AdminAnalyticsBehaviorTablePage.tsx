import moment from 'moment';
import React from 'react';
import { userInteractionFindMethod } from '../../../api/user-interaction/UserInteractionCollection.methods';
import BehaviorTable from '../../components/admin/analytics/BehaviorTable';
import DateIntervalSelector from '../../components/admin/analytics/DateIntervalSelector';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';
import { PAGEIDS } from '../../utilities/PageIDs';
import { useStickyState } from '../../utilities/StickyState';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'Student Behavior Table';
const headerPaneBody = `
First, select a time interval (defaults to the current day.)

Then, press "Submit" to obtain a table of the behaviors exhibited by students over the time period.

Note that User Interactions are generated for each day around midnight. So, today's user interactions are generally not available.
`;

const startOf = date => moment(date).startOf('day').toDate();
const startStickyStateID = 'AdminAnalyticsStudentSummaryPage.startDate';
const endStickyStateID = 'AdminAnalyticsStudentSummaryPage.endDate';
const userInteractionsStickyStateID = 'AdminAnalyticsStudentSummaryPage.userInteractions';

const AdminAnalyticsBehaviorTablePage: React.FC = () => {
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
  const header = <RadGradHeader title='Behavior Table'/>;
  return (
    <PageLayout id={PAGEIDS.ANALYTICS_BEHAVIOR_TABLE} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
      <RadGradSegment header={header}>
        <DateIntervalSelector startStickyStateID={startStickyStateID} endStickyStateID={endStickyStateID} onClick={onClick} />
        { userInteractions && <BehaviorTable userInteractions={userInteractions} /> }
      </RadGradSegment>
    </PageLayout>
  );
};

export default AdminAnalyticsBehaviorTablePage;
