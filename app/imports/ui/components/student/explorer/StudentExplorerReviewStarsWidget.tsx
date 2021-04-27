import React from 'react';
import { Rating } from 'semantic-ui-react';

interface StudentExplorerReviewStarsWidgetProps {
  rating: number;
}

const StudentExplorerReviewStarsWidget: React.FC<StudentExplorerReviewStarsWidgetProps> = ({ rating }) => <Rating size="large" icon="star" rating={rating} maxRating={5} disabled={false} />;

export default StudentExplorerReviewStarsWidget;
