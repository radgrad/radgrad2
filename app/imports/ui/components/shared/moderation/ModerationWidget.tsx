import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Reviews } from '../../../../api/review/ReviewCollection';
import { IReview } from '../../../../typings/radgrad';
import ModerationColumnWidget from './ModerationColumnWidget';

export interface IModerationWidget {
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

const ModerationWidget: React.FC<IModerationWidget> = ({ courseReviews, opportunityReviews }) => (
  <Grid columns="equal" divided="vertically">
    <Grid.Column>
      <ModerationColumnWidget
        handleAccept={handleAcceptReview}
        handleReject={handleRejectReview}
        reviews={courseReviews}
        isReview
        type="COURSE"
      />
    </Grid.Column>
    <Grid.Column>
      <ModerationColumnWidget
        handleAccept={handleAcceptReview}
        handleReject={handleRejectReview}
        reviews={opportunityReviews}
        isReview
        type="OPPORTUNITY"
      />
    </Grid.Column>
  </Grid>
);

export default ModerationWidget;
