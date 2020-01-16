import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Reviews } from '../../../api/review/ReviewCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { IMentorQuestion, IReview } from '../../../typings/radgrad';
import ModerationColumnWidget from './ModerationColumnWidget';

interface IModerationWidget {
  opportunityReviews: IReview[],
  courseReviews: IReview[],
  mentorQuestions: IMentorQuestion[],
}

const handleAcceptReview = (item, comments) => {
  // console.log('take in a review, give back an object w/ collection name and update data');
  // console.log(item);
  const updateInfo = { id: item._id, moderated: true, mentorComment: comments };
  const collectionName = Reviews.getCollectionName();
  return {
    updateInfo,
    collectionName,
  };
};

const handleRejectReview = (item, comments) => {
  // console.log('take in a review, give back an object w/ collection name and update data');
  // console.log(item);
  const updateInfo = { id: item._id, moderated: true, visible: false, mentorComment: comments };
  const collectionName = Reviews.getCollectionName();
  return {
    updateInfo,
    collectionName,
  };
};

const handleAcceptQuestion = (item, comments) => {
  // console.log('take in a question, give back an object w/ collection name and update data');
  // console.log(item);
  const updateInfo = { id: item._id, moderated: true, moderatorComment: comments };
  const collectionName = MentorQuestions.getCollectionName();
  return {
    updateInfo,
    collectionName,
  };
};

const handleRejectQuestion = (item, comments) => {
  // console.log('take in a question, give back an object w/ collection name and update data');
  // console.log(item);
  const updateInfo = { id: item._id, moderated: true, visible: false, moderatorComment: comments };
  const collectionName = MentorQuestions.getCollectionName();
  return {
    updateInfo,
    collectionName,
  };
};


const ModerationWidget = (props: IModerationWidget) => (
  <Grid columns="equal" divided="vertically">
    <Grid.Column>
      <ModerationColumnWidget
        handleAccept={handleAcceptReview}
        handleReject={handleRejectReview}
        reviews={props.courseReviews}
        isReview
        type="COURSE"
      />
    </Grid.Column>
    <Grid.Column>
      <ModerationColumnWidget
        handleAccept={handleAcceptReview}
        handleReject={handleRejectReview}
        reviews={props.opportunityReviews}
        isReview
        type="OPPORTUNITY"
      />
    </Grid.Column>
    <Grid.Column>
      <ModerationColumnWidget
        handleAccept={handleAcceptQuestion}
        handleReject={handleRejectQuestion}
        reviews={props.mentorQuestions}
        isReview={false}
        type="QUESTION"
      />
    </Grid.Column>
  </Grid>
);

const ModerationWidgetContainer = withTracker(() => ({
  opportunityReviews: Reviews.findNonRetired({ moderated: false, reviewType: 'opportunity' }),
  courseReviews: Reviews.findNonRetired({ moderated: false, reviewType: 'course' }),
  mentorQuestions: MentorQuestions.findNonRetired({ moderated: false }),
}))(ModerationWidget);

export default withRouter(ModerationWidgetContainer);
