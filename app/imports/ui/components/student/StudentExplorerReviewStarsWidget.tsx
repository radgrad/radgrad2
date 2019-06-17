import * as React from 'react';
import { Rating } from 'semantic-ui-react';

interface IStudentExplorerReviewStarsWidgetProps {
  rating: number;
}

class StudentExplorerReviewStarsWidget extends React.Component<IStudentExplorerReviewStarsWidgetProps> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <Rating size="large" icon="star" rating={this.props.rating} maxRating={5} disabled={true}/>
    );
  }
}

export default StudentExplorerReviewStarsWidget;
