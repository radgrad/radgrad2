import React from 'react';
import { Header, Segment, Container, Item } from 'semantic-ui-react';
import ModerationReview from './ModerationReview';
import ModerationQuestion from './ModerationQuestion';
import { Review } from '../../../../typings/radgrad';

interface ModerationColumnProps {
  handleAccept: (item, comment) => any;
  handleReject: (item, comment) => any;
  reviews: Review[];
  type: string;
}
// this will be the column widget that holds the individual moderation cards

const ModerationColumn: React.FC<ModerationColumnProps> = ({ type, handleAccept, handleReject, reviews }) => (
  <div>
    <Segment>
      <Header as="h4" textAlign="left" dividing>
        PENDING {type} REVIEWS
      </Header>
      {reviews.length > 0 ? (
        <Item.Group divided>
          {reviews.map((review, index) => (
            <Item key={review._id}>
              {' '}
              <ModerationReview item={review} handleAccept={handleAccept} handleReject={handleReject} />
            </Item>
          ))}
        </Item.Group>
      ) : (
        <React.Fragment>
          {reviews.length > 0 ? (
            <Item.Group divided>
              {reviews.map((question, index) => (
                <Item key={question._id}>
                  {' '}
                  <ModerationQuestion question={question} handleAccept={handleAccept} handleReject={handleReject} />
                </Item>
              ))}
            </Item.Group>
          ) : (
            <Container textAlign="left">
              <i>No pending {type.toLowerCase()} reviews</i>
            </Container>
          )}
        </React.Fragment>
      )}
    </Segment>
  </div>
);

export default ModerationColumn;
