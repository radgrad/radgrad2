import React from 'react';
import { Card, Header } from 'semantic-ui-react';
import { ReviewFactoid } from '../../../../typings/radgrad';

const ReviewFactoid :React.FC<ReviewFactoid> = ({ name, description }) => (
  <div id="review-factoid">
    <Header inverted>RadGrad provides high quality reviews of courses and extracurricular activities.</Header>
    <Card>
      <Card.Content>
        <Card.Header>{name}</Card.Header>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
    </Card>
  </div>
);

export default ReviewFactoid;
