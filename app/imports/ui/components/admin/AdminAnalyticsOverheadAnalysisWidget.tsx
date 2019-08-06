import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import * as moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';
import { Header, Segment, Tab } from 'semantic-ui-react';
import AdminAnalyticsDateSelectionWidget from './AdminAnalyticsDateSelectionWidget';
import { ANALYTICS } from '../../../startup/client/routes-config';
// eslint-disable-next-line no-unused-vars
import { ReduxTypes } from '../../../redux';
import UserSessionOverheadWidget from './UserSessionOverheadWidget';
import OverallServerLoadWidget from './OverallServerLoadWidget';

interface IAdminAnalyticsOverheadAnalysisWidgetProps {
  startDate: Date;
  endDate: Date;
  dateRange: string;
}

const mapStateToProps = (state: ReduxTypes.State): { startDate?: Date; endDate?: Date; } => ({
  startDate: state.admin.analytics.overheadAnalysis.startDate,
  endDate: state.admin.analytics.overheadAnalysis.endDate,
});

const getDateRange = (props): string => {
  const { startDate, endDate } = props;
  if (startDate === undefined || endDate === undefined) {
    return '';
  }
  const start = moment(startDate).format('MM-DD-YYYY');
  const end = moment(endDate).format('MM-DD-YYYY');
  return `${start} twwo ${end}`;
};

class AdminAnalyticsOverheadAnalysisWidget extends React.Component<IAdminAnalyticsOverheadAnalysisWidgetProps> {
  constructor(props) {
    super(props);
  }

  // private getDateRange = (): string => {
  //   const { startDate, endDate } = this.props;
  //   if (startDate === undefined || endDate === undefined) {
  //     return '';
  //   }
  //   const start = moment(startDate).format('MM-DD-YYYY');
  //   const end = moment(endDate).format('MM-DD-YYYY');
  //   return `${start} to ${end}`;
  // }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { dateRange } = this.props;
    const tabMenuSettings = {
      pointing: true,
      secondary: true,
    };
    const panes = [
      {
        menuItem: 'User Session Overhead',
        render: () => <UserSessionOverheadWidget/>,
      },
      {
        menuItem: 'Overall Server Load',
        render: () => <OverallServerLoadWidget/>,
      },
    ];
    return (
      <React.Fragment>
        <AdminAnalyticsDateSelectionWidget page={ANALYTICS.OVERHEADANALYSIS}/>

        <Segment padded={true} className="container">
          {/* TODO: Make this reactive */}
          <Header dividing={true}>{`${dateRange} ${_.uniqueId()}`}</Header>
          <Tab panes={panes} menu={tabMenuSettings}/>
        </Segment>
      </React.Fragment>
    );
  }
}

const AdminAnalyticsOverheadAnalysisWidgetCon = connect(mapStateToProps)(AdminAnalyticsOverheadAnalysisWidget);
export default withTracker((props) => {
  const dateRange = getDateRange(props);
  return {
    dateRange,
  };
})(AdminAnalyticsOverheadAnalysisWidgetCon);
