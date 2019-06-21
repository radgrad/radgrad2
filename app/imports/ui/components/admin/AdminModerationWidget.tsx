import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Grid, Container, Header, Card, Segment, Button } from 'semantic-ui-react';
import { Reviews } from '../../../api/review/ReviewCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { IMentorQuestion, IReview } from '../../../typings/radgrad';
import { withTracker } from 'meteor/react-meteor-data'; // eslint-disable-line
import AdminModerationColumnWidget from './AdminModerationColumnWidget'
import { Slugs } from '../../../api/slug/SlugCollection';
import { withRouter } from 'react-router-dom';


interface IAdminModerationWidget {
  opportunityReviews: IReview[],
  courseReviews: IReview[],
  mentorQuestions: IMentorQuestion[],
}

class AdminModerationWidget extends React.Component<IAdminModerationWidget> {
  constructor(props) {
    super(props);
    console.log('Admin Moderation Widget props constructor: ', props);
  }

  // handle approve by updateData.call
  private handleApproveReview = (item) => {
    console.log('Approve the Review');
  }

  private handleDenyReview = (item) => {
    console.log('Deny the Review');
  }
  private handleApproveQuestion = (item) => {
    console.log(item);
  }
  private handleDenyQuestion = (item) => {
    console.log(item);
  }

  // do I need this?
  private getType = (item) => {

  }

  public render() {
    console.log('Admin Moderation Widget props: ', this.props);
    return (
      <Container>
        <Grid columns='equal' padded={true}>
          <Grid.Column>
            <AdminModerationColumnWidget handleApprove={this.handleApproveReview} handleDeny={this.handleDenyReview}
                                         reviews={this.props.courseReviews} isReview={true} type={'COURSE'}/>
          </Grid.Column>
          <Grid.Column>
            <AdminModerationColumnWidget handleApprove={this.handleApproveReview} handleDeny={this.handleDenyReview}
                                         reviews={this.props.opportunityReviews} isReview={true} type={'OPPORTUNITY'}/>
          </Grid.Column>
          <Grid.Column>
            <AdminModerationColumnWidget handleApprove={this.handleApproveQuestion} handleDeny={this.handleDenyQuestion}
                                         reviews={this.props.mentorQuestions} isReview={false} type={'QUESTION'}/>
          </Grid.Column>
        </Grid>
      </Container>
    )
  }
};

const AdminModerationWidgetContainer = withTracker((c) => ({
  opportunityReviews: Reviews.findNonRetired({ moderated: false, reviewType: 'opportunity' }),
  courseReviews: Reviews.findNonRetired({ moderated: false, reviewType: 'course' }),
  mentorQuestions: MentorQuestions.findNonRetired({ moderated: false }),
}))(AdminModerationWidget);

export default withRouter(AdminModerationWidgetContainer);
