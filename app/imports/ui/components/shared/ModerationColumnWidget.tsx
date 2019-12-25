// this will be the column widget that holds the individual moderation cards
import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data'; // eslint-disable-line
import { Header, Segment, Container, Item } from 'semantic-ui-react';
import ModerationReviewCardWidget from './ModerationReviewCardWidget';
import ModerationQuestionCardWidget from './ModerationQuestionCardWidget';

interface IModerationColumn {
  handleAccept: (item, comment) => any,
  handleReject: (item, comment) => any,
  reviews: any,
  isReview: boolean,
  type: string

}

const ModerationColumnWidget = (props: IModerationColumn) => (
  <div>
    <Segment>
      <Header as="h4" textAlign="left" dividing>
PENDING
        {props.type}
        {' '}
REVIEWS
        {' '}
      </Header>
      {props.isReview && props.reviews.length > 0 ? (
        <Item.Group divided>
          {props.reviews.map((review, index) => (
            <Item key={review._id}>
              {' '}
              <ModerationReviewCardWidget
                item={review}
                handleAccept={props.handleAccept}
                handleReject={props.handleReject}
              />
            </Item>
))}
        </Item.Group>
      )
        : (
          <React.Fragment>
            {
            (props.isReview === false && props.reviews.length > 0) ? (
              <Item.Group divided>
                {props.reviews.map((question, index) => (
                  <Item key={question._id}>
                    {' '}
                    <ModerationQuestionCardWidget
                      question={question}
                      handleAccept={props.handleAccept}
                      handleReject={props.handleReject}
                    />
                  </Item>
))}
              </Item.Group>
            )
              : (
                <Container textAlign="left">
                  <i>
No pending
                    {props.type.toLowerCase()}
                    {' '}
reviews
                  </i>
                </Container>
            )
}
          </React.Fragment>
      )}

    </Segment>
  </div>
);

export default withRouter(ModerationColumnWidget);
