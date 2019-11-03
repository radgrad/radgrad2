import * as React from 'react';
import { Rating } from 'semantic-ui-react';

interface IStudentExplorerReviewStarsWidgetProps {
  rating: number;
}

const StudentExplorerReviewStarsWidget = (props: IStudentExplorerReviewStarsWidgetProps) => (
  <Rating size="large" icon="star" rating={props.rating} maxRating={5} disabled={true}/>
);

export default StudentExplorerReviewStarsWidget;
