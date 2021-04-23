import React from 'react';
import { Menu, Tab } from 'semantic-ui-react';
import { Review } from '../../../../typings/radgrad';
import RadGradHeader from '../../shared/RadGradHeader';
import ReviewItem from './ReviewItem';

interface StudentReviewsTabProps {
  courseReviews: Review[];
  opportunityReviews: Review[];
  username: string;
}

const StudentReviewsTab: React.FC<StudentReviewsTabProps> = ({ courseReviews, opportunityReviews,  username }) => {
  const panes = [
    {
      menuItem: <Menu.Item key='course-reviews-tab'><RadGradHeader title='my course reviews' count={courseReviews ? courseReviews.length : 0} icon='book' /></Menu.Item>,
      render: () => (
        <Tab.Pane>
          {courseReviews.map((review) => <ReviewItem review={review} key={review._id} />)}
        </Tab.Pane>
      ),
    },
    {
      menuItem: <Menu.Item key='opportunity-reviews-tab'><RadGradHeader title='my opportunity reviews' count={opportunityReviews ? opportunityReviews.length : 0} icon='light bulb' /></Menu.Item>,
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
