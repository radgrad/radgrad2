import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Reviews } from '../../../api/review/ReviewCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { IMentorQuestion, IReview, IReviewUpdateData } from '../../../typings/radgrad'; // eslint-disable-line
import ModerationColumnWidget from './ModerationColumnWidget';

interface IModerationWidget {
  opportunityReviews: IReview[],
  courseReviews: IReview[],
  mentorQuestions: IMentorQuestion[],
}

class ModerationWidget extends React.Component<IModerationWidget> {
  constructor(props) {
    super(props);
  }

  // handle approve by updateData.call
  private handleAcceptReview = (item, comments) => {
    console.log('take in a review, give back an object w/ collection name and update data');
    console.log(item);
    const updateInfo = { id: item._id, moderated: true, mentorComment: comments };
    const collectionName = Reviews.getCollectionName();
    return {
      updateInfo,
      collectionName,
    };
  }

  private handleRejectReview = (item, comments) => {
    console.log('take in a review, give back an object w/ collection name and update data');
    console.log(item);
    const updateInfo = { id: item._id, moderated: true, visible: false, mentorComment: comments };
    const collectionName = Reviews.getCollectionName();
    return {
      updateInfo,
      collectionName,
    };
  };


  private handleAcceptQuestion = (item, comments) => {
    console.log('take in a question, give back an object w/ collection name and update data');
    console.log(item);
    const updateInfo = { id: item._id, moderated: true, moderatorComment: comments };
    const collectionName = MentorQuestions.getCollectionName();
    return {
      updateInfo,
      collectionName,
    };
  };

  private handleRejectQuestion = (item, comments) => {
    console.log('take in a question, give back an object w/ collection name and update data');
    console.log(item);
    const updateInfo = { id: item._id, moderated: true, visible: false, moderatorComment: comments };
    const collectionName = MentorQuestions.getCollectionName();
    return {
      updateInfo,
      collectionName,
    };
  };


  public render() {
    return (
      <Grid columns='equal' divided='vertically'>
        <Grid.Column>
          <ModerationColumnWidget handleAccept={this.handleAcceptReview} handleReject={this.handleRejectReview}
                                  reviews={this.props.courseReviews} isReview={true} type={'COURSE'}/>
        </Grid.Column>
        <Grid.Column>
          <ModerationColumnWidget handleAccept={this.handleAcceptReview} handleReject={this.handleRejectReview}
                                  reviews={this.props.opportunityReviews} isReview={true} type={'OPPORTUNITY'}/>
        </Grid.Column>
        <Grid.Column>
          <ModerationColumnWidget handleAccept={this.handleAcceptQuestion}
                                  handleReject={this.handleRejectQuestion}
                                  reviews={this.props.mentorQuestions} isReview={false} type={'QUESTION'}/>
        </Grid.Column>
      </Grid>
    );
  }
}

const ModerationWidgetContainer = withTracker(() => ({
  opportunityReviews: Reviews.findNonRetired({ moderated: false, reviewType: 'opportunity' }),
  courseReviews: Reviews.findNonRetired({ moderated: false, reviewType: 'course' }),
  mentorQuestions: MentorQuestions.findNonRetired({ moderated: false }),
}))(ModerationWidget);

export default withRouter(ModerationWidgetContainer);
