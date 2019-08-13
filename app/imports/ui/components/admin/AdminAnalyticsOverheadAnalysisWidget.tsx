import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { Header, Segment, Tab } from 'semantic-ui-react';
import AdminAnalyticsDateSelectionWidget from './AdminAnalyticsDateSelectionWidget';
import { ANALYTICS } from '../../../startup/client/routes-config';
// eslint-disable-next-line no-unused-vars
import { ReduxTypes } from '../../../redux';
import UserSessionOverheadWidget from './UserSessionOverheadWidget';
import OverallServerLoadWidget from './OverallServerLoadWidget';

interface IAdminAnalyticsOverheadAnalysisWidgetProps {
  dateRange: {
    startDate: Date;
    endDate: Date;
  }
}

const mapStateToProps = (state: ReduxTypes.State): { dateRange: { startDate: Date; endDate: Date; } } => ({
  dateRange: state.admin.analytics.overheadAnalysis.dateRange,
});

class AdminAnalyticsOverheadAnalysisWidget extends React.Component<IAdminAnalyticsOverheadAnalysisWidgetProps> {
  constructor(props) {
    super(props);
  }

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
export default AdminAnalyticsOverheadAnalysisWidgetCon;
