import React from 'react';
import { Rating } from 'semantic-ui-react';

interface IStudentExplorerReviewStarsWidgetProps {
  rating: number;
}

const StudentExplorerReviewStarsWidget: React.FC<IStudentExplorerReviewStarsWidgetProps> = ({ rating }) => (
  <Rating size="large" icon="star" rating={rating} maxRating={5} disabled />
);

export default StudentExplorerReviewStarsWidget;
