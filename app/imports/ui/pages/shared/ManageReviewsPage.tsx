import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import { Reviews } from '../../../api/review/ReviewCollection';
import AdminModerationWidget, { ModerationWidgetProps } from '../../components/shared/moderation/ModerationWidget';

const headerPaneTitle = 'Manage student-submitted reviews';
const headerPaneBody = `
Students can submit reviews of courses and opportunities. 

Faculty and advisors should check these reviews to ensure they are appropriate for public display.
`;

const ManageReviewsPage: React.FC<ModerationWidgetProps> = ({ courseReviews, opportunityReviews }) => (
  <PageLayout id={PAGEIDS.MANAGE_REVIEWS} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
    <AdminModerationWidget courseReviews={courseReviews} opportunityReviews={opportunityReviews} />
  </PageLayout>
);

const ManageReviewsPageContainer = withTracker(() => ({
  opportunityReviews: Reviews.findNonRetired({ moderated: false, reviewType: 'opportunity' }),
  courseReviews: Reviews.findNonRetired({ moderated: false, reviewType: 'course' }),
}))(ManageReviewsPage);

export default ManageReviewsPageContainer;
