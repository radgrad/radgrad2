import React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Header } from 'semantic-ui-react';

const AdminAnalyticsStudentSummaryWidget = () => (
  <div>
    <Segment>
      <Header as="h4" dividing>SUMMARY STATISTICS</Header>
    </Segment>
  </div>
);

export default withRouter(AdminAnalyticsStudentSummaryWidget);
