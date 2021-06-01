import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { Review } from '../../../typings/radgrad';
import ModerationColumn from '../../components/shared/moderation/ModerationColumn';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import { Reviews } from '../../../api/review/ReviewCollection';

const headerPaneTitle = 'Manage student-submitted reviews';
const headerPaneBody = `
Students can submit reviews of courses and opportunities. 

Faculty and advisors should check these reviews to ensure they are appropriate for public display.
`;

interface ModerationWidgetProps {
  opportunityReviews: Review[];
  courseReviews: Review[];
}

const handleReview = (item: Review, comments: string, approved: boolean) => {
  // If the review is approved, the visible review filled will be true
  const updateInfo = { id: item._id, moderated: true, visible: approved, moderatorComments: comments };
  const collectionName = Reviews.getCollectionName();
  return {
    updateInfo,
    collectionName,
  };
};

const ManageReviewsPage: React.FC<ModerationWidgetProps> = ({ courseReviews, opportunityReviews }) => (
  <PageLayout id={PAGEIDS.MANAGE_REVIEWS} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
    <Grid columns="equal" divided="vertically">
      <Grid.Column>
        <ModerationColumn handleReview={handleReview} reviews={courseReviews} type="COURSE" />
      </Grid.Column>
      <Grid.Column>
        <ModerationColumn handleReview={handleReview} reviews={opportunityReviews} type="OPPORTUNITY" />
      </Grid.Column>
    </Grid>
  </PageLayout>
);

export default withTracker(() => {
  const opportunityReviews = Reviews.findNonRetired({ moderated: false, reviewType: 'opportunity' });
  const courseReviews = Reviews.findNonRetired({ moderated: false, reviewType: 'course' });
  return {
    opportunityReviews,
    courseReviews,
  };
})(ManageReviewsPage);
