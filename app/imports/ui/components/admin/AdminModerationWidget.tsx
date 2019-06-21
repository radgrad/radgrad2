import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Grid, Container, Header, Card, Segment, Button } from 'semantic-ui-react';
import { Reviews } from '../../../api/review/ReviewCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { IMentorQuestion, IReview, IReviewUpdateData } from '../../../typings/radgrad';
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
  }

  // handle approve by updateData.call
  private handleAcceptReview = (item) => {
    console.log('take in a review, give back an object w/ collection name and update data');
    console.log(item);
    const updateInfo = {id: item._id, moderated: true};
    const collectionName = Reviews.getCollectionName();
    return{
      updateInfo,
      collectionName
    }

  }

  private handleRejectReview = (item) => {
    console.log('take in a review, give back an object w/ collection name and update data');
    console.log(item);
    const updateInfo = {id: item._id, moderated: true, visible: false};
    const collectionName = Reviews.getCollectionName();
    return {
      updateInfo,
      collectionName
    }
  }


  private handleAcceptQuestion = (item) => {
    console.log('Accept the Question');
  }
  private handleRejectQuestion = (item) => {
    console.log('Reject the Question');
  }

  // do I need this?
  private getType = (item) => {

  }

  public render() {
    return (
      <Container>
        <Grid columns='equal' padded={true}>
          <Grid.Column>
            <AdminModerationColumnWidget handleAccept={this.handleAcceptReview} handleReject={this.handleRejectReview}
                                         reviews={this.props.courseReviews} isReview={true} type={'COURSE'}/>
          </Grid.Column>
          <Grid.Column>
            <AdminModerationColumnWidget handleAccept={this.handleAcceptReview} handleReject={this.handleRejectReview}
                                         reviews={this.props.opportunityReviews} isReview={true} type={'OPPORTUNITY'}/>
          </Grid.Column>
          <Grid.Column>
            <AdminModerationColumnWidget handleAccept={this.handleAcceptQuestion}
                                         handleReject={this.handleRejectQuestion}
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
