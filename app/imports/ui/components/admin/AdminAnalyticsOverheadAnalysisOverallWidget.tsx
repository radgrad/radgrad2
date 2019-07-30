import * as React from 'react';
import { withRouter } from 'react-router-dom';
import AdminAnalyticsDateSelectionWidget from './AdminAnalyticsDateSelectionWidget';
import AdminAnalyticsOverheadAnalysisWidget from './AdminAnalyticsOverheadAnalysisWidget';

class AdminAnalyticsOverheadAnalysisOverallWidget extends React.Component {

  public render() {
    return (
      <div>
        <AdminAnalyticsDateSelectionWidget/>
        <AdminAnalyticsOverheadAnalysisWidget/>
      </div>
    );
  }
}

export default withRouter(AdminAnalyticsOverheadAnalysisOverallWidget);
