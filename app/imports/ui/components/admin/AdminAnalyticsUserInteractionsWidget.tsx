import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Header } from 'semantic-ui-react';

interface IAdminAnalyticsUserInteractionsWidget {

}

class AdminAnalyticsUserInteractionsWidget extends React.Component<IAdminAnalyticsUserInteractionsWidget> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div>
        <Segment>
          <Header as='h4' dividing>USER INTERACTIONS</Header>
        </Segment>
      </div>
    );
  }
}

export default withRouter(AdminAnalyticsUserInteractionsWidget);
