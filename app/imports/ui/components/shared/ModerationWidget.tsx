import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Reviews } from '../../../api/review/ReviewCollection';
import { IReview } from '../../../typings/radgrad';
import ModerationColumnWidget from './ModerationColumnWidget';

interface IModerationWidget {
  opportunityReviews: IReview[],
  courseReviews: IReview[],
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
  </Grid>
);

const ModerationWidgetContainer = withTracker(() => ({
  opportunityReviews: Reviews.findNonRetired({ moderated: false, reviewType: 'opportunity' }),
  courseReviews: Reviews.findNonRetired({ moderated: false, reviewType: 'course' }),
}))(ModerationWidget);

export default withRouter(ModerationWidgetContainer);
