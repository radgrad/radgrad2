import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import Markdown from 'react-markdown';
import { Divider, Grid, Header, Icon, List, Message } from 'semantic-ui-react';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Review } from '../../../../typings/radgrad';
import { COMPONENTIDS } from '../../../utilities/ComponentIDs';
import * as Router from '../../shared/utilities/router';
import StudentExplorerReviewStarsWidget from '../explorer/StudentExplorerReviewStarsWidget';
import DeleteReviewButton from './DeleteReviewButton';
import EditReviewButton from './EditReviewButton';
import { getRevieweeName } from './utilities/review-name';

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const commentsStyle = { paddingTop: '5px' };
  const match = useRouteMatch();
  const itemName = getRevieweeName(review);

  return (
    <List.Item key={review._id}>
      <Grid id={COMPONENTIDS.STUDENT_REVIEW_ITEM}>
        {review.visible ? '' :
          <Grid.Row>
            {review.moderated ?
              <Message error style={{ marginTop: 10, marginLeft: 16 }}>
                <Icon name='flag' />
                This content violates our policies. Please edit your content to repost.
                <hr/>
                <Message.Header>Moderator Comments</Message.Header>
                {review.moderatorComments}
              </Message>
              :
              <Message warning style={{ marginTop: 10, marginLeft: 16 }}><Icon name='warning' />Your review will be public once it is accepted by an admin.</Message>}
          </Grid.Row>}
        <Grid.Column width={4}>
          {AcademicTerms.toString(review.termID)}
        </Grid.Column>
        <Grid.Column width={8} />
        <Grid.Column width={4} floated='right'>
          <EditReviewButton review={review} />
          <DeleteReviewButton review={review} />
        </Grid.Column>
        <Grid.Column width={16}>
          <Header>{itemName}</Header>
        </Grid.Column>

        <Grid.Column width={16}>
          <StudentExplorerReviewStarsWidget rating={review.rating} />
          <br />
        </Grid.Column>
        <Grid.Column width={16}>
          <div style={commentsStyle}>
            <Markdown escapeHtml source={review.comments} renderers={{ link: (props2) => Router.renderLink(props2, match) }} />
          </div>
        </Grid.Column>
      </Grid>
      <Divider />
    </List.Item>
  );

};

export default ReviewItem;
