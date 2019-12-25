import React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Header } from 'semantic-ui-react';

const AdminAnalyticsUserInteractionsWidget = () => (
  <div>
    <Segment>
      <Header as="h4" dividing>USER INTERACTIONS</Header>
    </Segment>
  </div>
);

export default withRouter(AdminAnalyticsUserInteractionsWidget);
