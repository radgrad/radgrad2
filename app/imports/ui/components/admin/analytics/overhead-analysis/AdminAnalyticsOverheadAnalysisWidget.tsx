import React from 'react';
import { connect } from 'react-redux';
import { Header, Segment, Tab } from 'semantic-ui-react';
import moment from 'moment';
import AdminAnalyticsDateSelectionWidget from '../AdminAnalyticsDateSelectionWidget';
import { ANALYTICS } from '../../../../layouts/utilities/route-constants';
import UserSessionOverheadWidget from './UserSessionOverheadWidget';
import OverallServerLoadWidget from './OverallServerLoadWidget';
import { RootState } from '../../../../../redux/types';
import { AdminAnalyticsDateRange } from '../../../../../redux/admin/analytics/reducers';

interface AdminAnalyticsOverheadAnalysisWidgetProps {
  dateRange: AdminAnalyticsDateRange
}

const mapStateToProps = (state: RootState): {[key: string]: any} => ({
  dateRange: state.admin.analytics.overheadAnalysis.dateRange,
});

const dateRangeToString = (dateRange: AdminAnalyticsDateRange): string | JSX.Element => {
  if (dateRange.startDate && dateRange.endDate) {
    const start = moment(dateRange.startDate).format('MM-DD-YYYY');
    const end = moment(dateRange.endDate).format('MM-DD-YYYY');
    return ` ${start} to ${end}`;
  }
  return <i>Select a Start date and End date above</i>;
};

const AdminAnalyticsOverheadAnalysisWidget: React.FC<AdminAnalyticsOverheadAnalysisWidgetProps> = ({ dateRange }) => {
  const tabMenuSettings = {
    pointing: true,
    secondary: true,
  };
  const panes = [
    {
      menuItem: 'User Session Overhead',
      render: () => <UserSessionOverheadWidget />,
    },
    {
      menuItem: 'Overall Server Load',
      render: () => <OverallServerLoadWidget />,
    },
  ];
  return (
    <React.Fragment>
      <AdminAnalyticsDateSelectionWidget page={ANALYTICS.OVERHEADANALYSIS} />
      <Segment padded className="container">
        <Header dividing>{dateRangeToString(dateRange)}</Header>
        <Tab panes={panes} menu={tabMenuSettings} />
      </Segment>
    </React.Fragment>
  );
};

const AdminAnalyticsOverheadAnalysisWidgetCon = connect(mapStateToProps)(AdminAnalyticsOverheadAnalysisWidget);
export default AdminAnalyticsOverheadAnalysisWidgetCon;