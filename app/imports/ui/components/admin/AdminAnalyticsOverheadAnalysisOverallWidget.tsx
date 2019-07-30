import * as React from 'react';
import { withRouter } from 'react-router-dom';
import AdminAnalyticsDateSelectionWidget from './AdminAnalyticsDateSelectionWidget';
import { ANALYTICS } from '../../../startup/client/routes-config';

class AdminAnalyticsOverheadAnalysisOverallWidget extends React.Component {

  public render() {
    return (
      <React.Fragment>
        <AdminAnalyticsDateSelectionWidget page={ANALYTICS.OVERHEADANALYSIS}/>
      </React.Fragment>
    );
  }
}

export default withRouter(AdminAnalyticsOverheadAnalysisOverallWidget);
