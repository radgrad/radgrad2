import React from 'react';
import { Header, Segment, Container, Item } from 'semantic-ui-react';
import ModerationReviewCardWidget from './ModerationReviewCardWidget';
import ModerationQuestionCardWidget from './ModerationQuestionCardWidget';
import { IReview } from '../../../../typings/radgrad';

interface IModerationColumn {
  handleAccept: (item, comment) => any,
  handleReject: (item, comment) => any,
  reviews: IReview[],
  isReview: boolean, // TODO do we need this?
  type: string
}
// this will be the column widget that holds the individual moderation cards

const ModerationColumnWidget: React.FC<IModerationColumn> = ({ isReview, type, handleAccept, handleReject, reviews }) => (
  <div>
    <Segment>
      <Header as="h4" textAlign="left" dividing>
        PENDING {type} REVIEWS
      </Header>
      {isReview && reviews.length > 0 ? (
        <Item.Group divided>
          {reviews.map((review, index) => (
            <Item key={review._id}>
              {' '}
              <ModerationReviewCardWidget
                item={review}
                handleAccept={handleAccept}
                handleReject={handleReject}
              />
            </Item>
          ))}
        </Item.Group>
      )
        : (
          <React.Fragment>
            {
            (isReview === false && reviews.length > 0) ? (
              <Item.Group divided>
                {reviews.map((question, index) => (
                  <Item key={question._id}>
                    {' '}
                    <ModerationQuestionCardWidget
                      question={question}
                      handleAccept={handleAccept}
                      handleReject={handleReject}
                    />
                  </Item>
                ))}
              </Item.Group>
            )
              : (
                <Container textAlign="left">
                  <i>
                    No pending {type.toLowerCase()} reviews
                  </i>
                </Container>
              )
}
          </React.Fragment>
        )}

    </Segment>
  </div>
);

export default ModerationColumnWidget;
