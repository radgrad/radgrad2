import React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Header } from 'semantic-ui-react';

class AdminAnalyticsStudentSummaryWidget extends React.Component {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div>
        <Segment>
          <Header as="h4" dividing>SUMMARY STATISTICS</Header>
        </Segment>
      </div>
    );
  }
}

export default withRouter(AdminAnalyticsStudentSummaryWidget);
