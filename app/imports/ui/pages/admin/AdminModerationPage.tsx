import React from 'react';
import { Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminModerationWidget, { IModerationWidget } from '../../components/shared/moderation/ModerationWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { Reviews } from '../../../api/review/ReviewCollection';

const AdminModerationPage: React.FC<IModerationWidget> = ({ courseReviews, opportunityReviews }) => {
  const paddedStyle = {
    paddingTop: 20,
  };
  return (
    <div id="admin-moderation-page">
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>
        <Grid.Column>
          <AdminModerationWidget courseReviews={courseReviews} opportunityReviews={opportunityReviews} />
        </Grid.Column>
      </Grid>

      <BackToTopButton />
    </div>
  );
};

const AdminModerationPageContainer = withTracker(() => ({
  opportunityReviews: Reviews.findNonRetired({ moderated: false, reviewType: 'opportunity' }),
  courseReviews: Reviews.findNonRetired({ moderated: false, reviewType: 'course' }),
}))(AdminModerationPage);

export default AdminModerationPageContainer;
