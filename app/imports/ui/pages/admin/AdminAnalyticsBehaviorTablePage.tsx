import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Form, Table } from 'semantic-ui-react';
import { USER_INTERACTION_DESCRIPTIONS } from '../../../api/user-interaction/UserInteractionCollection';
import { userInteractionFindMethod } from '../../../api/user-interaction/UserInteractionCollection.methods';
import DateIntervalSelector from '../../components/admin/analytics/DateIntervalSelector';
import DatePicker from 'react-datepicker';
import UserLabel from '../../components/shared/profile/UserLabel';
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
  const [startDate, setStartDate] = useStickyState(startStickyStateID, startOf(moment().subtract(1, 'days')));
  const [endDate, setEndDate] = useStickyState(endStickyStateID, startOf(moment().add(1, 'days')));
  const handleChangeStartDate = (date: Date) => setStartDate(startOf(date));
  const handleChangeEndDate = (date: Date) => setEndDate(startOf(date));
  const [userInteractions, setUserInteractions] = useStickyState(userInteractionsStickyStateID, null);
  const groups = _.groupBy(userInteractions, 'type');
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
        <Form>
          <Form.Group>
            <Form.Input label="Start Date">
              <DatePicker onChange={handleChangeStartDate} selected={startDate} maxDate={endDate} />
            </Form.Input>
            <Form.Input label="End Date (midnight of day before)">
              <DatePicker onChange={handleChangeEndDate} selected={endDate} minDate={startDate} />
            </Form.Input>
          </Form.Group>
          <Form.Button onClick={onClick}>Submit</Form.Button>
        </Form>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Behavior</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Num Users</Table.HeaderCell>
              <Table.HeaderCell>Users</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.keys(groups).map(key => {
              const behavior = key;
              const description = USER_INTERACTION_DESCRIPTIONS[behavior];
              const users = groups[key].map(instance => instance.username).map(username => <UserLabel key={username} username={username}/>);
              return (
                <Table.Row key={behavior}>
                  <Table.Cell>{behavior}</Table.Cell>
                  <Table.Cell>{description}</Table.Cell>
                  <Table.Cell>{users.length}</Table.Cell>
                  <Table.Cell>{users}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </RadGradSegment>
    </PageLayout>
  );
};

export default AdminAnalyticsBehaviorTablePage;
