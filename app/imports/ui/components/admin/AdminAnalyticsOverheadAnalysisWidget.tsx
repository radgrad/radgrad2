import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Header } from 'semantic-ui-react';

interface IAdminAnalyticsOverheadAnalysisWidget {

}

class AdminAnalyticsOverheadAnalysisWidget extends React.Component<IAdminAnalyticsOverheadAnalysisWidget> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (

      <div>
        <Segment>
          <Header as='h4' dividing>OVERHEAD ANALYSIS</Header>
        </Segment>
      </div>
    );
  }
}

export default withRouter(AdminAnalyticsOverheadAnalysisWidget);
