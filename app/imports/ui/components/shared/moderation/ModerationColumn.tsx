import React from 'react';
import { Container, Item } from 'semantic-ui-react';
import RadGradHeader from '../RadGradHeader';
import RadGradSegment from '../RadGradSegment';
import ModerationReview from './ModerationReview';
import { Review } from '../../../../typings/radgrad';

interface ModerationColumnProps {
  handleReview: (item, comment, approved) => any;
  reviews: Review[];
  type: string;
}

// this will be the column widget that holds the individual moderation cards

const ModerationColumn: React.FC<ModerationColumnProps> = ({ type, handleReview, reviews }) => (
  <RadGradSegment header={<RadGradHeader title={`PENDING ${type} REVIEWS`} dividing />}>
    {reviews.length > 0 ? (
      <Item.Group divided>
        {reviews.map((review, index) => (
          <Item key={review._id}>
            {' '}
            <ModerationReview item={review} handleReview={handleReview} />
          </Item>
        ))}
      </Item.Group>
    ) : (
      <Container textAlign="left">
        <i>No pending {type.toLowerCase()} reviews</i>
      </Container>
    )}
  </RadGradSegment>
);

export default ModerationColumn;
