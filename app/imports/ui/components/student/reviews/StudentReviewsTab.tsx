import React from 'react';
import { Menu, Tab } from 'semantic-ui-react';
import { Review } from '../../../../typings/radgrad';
import RadGradTabHeader from '../../shared/RadGradTabHeader';
import ReviewItem from './ReviewItem';

interface StudentReviewsTabProps {
  courseReviews: Review[];
  opportunityReviews: Review[];
  username: string;
}

const StudentReviewsTab: React.FC<StudentReviewsTabProps> = ({ courseReviews, opportunityReviews,  username }) => {
  const panes = [
    {
      menuItem: <Menu.Item key='course-reviews-tab'><RadGradTabHeader title='my course reviews' count={courseReviews ? courseReviews.length : 0} icon='book' /></Menu.Item>, // CAM The count code might be overkill. I was getting undefined for opportunityReviews.
      render: () => (
        <Tab.Pane>
          {courseReviews.map((review) => <ReviewItem review={review} key={review._id} />)}
        </Tab.Pane>
      ),
    },
    {
      menuItem: <Menu.Item key='opportunity-reviews-tab'><RadGradTabHeader title='my opportunity reviews' count={opportunityReviews ? opportunityReviews.length : 0} icon='lightbulb' /></Menu.Item>,
      render: () => (
        <Tab.Pane>
          {opportunityReviews.map((review) => <ReviewItem review={review} key={review._id} />)}
        </Tab.Pane>
      ),
    },
  ];
  return (
    <Tab panes={panes} />
  );
};

export default StudentReviewsTab;
