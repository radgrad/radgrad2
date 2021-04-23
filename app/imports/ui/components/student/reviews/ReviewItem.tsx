import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import Markdown from 'react-markdown';
import { Button, Divider, Grid, Header, Icon, List, Message } from 'semantic-ui-react';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { Reviews } from '../../../../api/review/ReviewCollection';
import { Review } from '../../../../typings/radgrad';
import * as Router from '../../shared/utilities/router';
import StudentExplorerReviewStarsWidget from '../explorer/StudentExplorerReviewStarsWidget';

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const commentsStyle = { paddingTop: '5px' };
  const match = useRouteMatch();
  let itemName;
  switch (review.reviewType) {
    case Reviews.COURSE: {
      const course = Courses.findDoc(review.revieweeID);
      itemName = `${course.shortName} (${course.name}) | ${course.num}`;
      break;
    }
    case Reviews.OPPORTUNITY: {
      const opp = Opportunities.findDoc(review.revieweeID);
      itemName = opp.name;
      break;
    }
    default:
      itemName = '';
  }

  const handleEdit = () => {
    console.log('handleEdit', review);
  };

  const handleDelete = () => {
    console.log('handleDelete', review);
  };

  return (
    <List.Item key={review._id}>
      <Grid>
        {review.visible ? '' :
          <Grid.Row>
            <Message error style={{ marginTop: 10, marginLeft: 16 }}><Icon name='flag' />This content violates our
              policies. Please edit your content to repost.</Message>
          </Grid.Row>}
        <Grid.Column width={4}>
          {AcademicTerms.toString(review.termID)}
        </Grid.Column>
        <Grid.Column width={8} />
        <Grid.Column width={4} floated='right'>
          <Button basic color='green' onClick={handleEdit}>EDIT</Button>
          <Button basic color='red' onClick={handleDelete}>DELETE</Button>
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
            <Markdown escapeHtml source={review.comments}
                      renderers={{ link: (props2) => Router.renderLink(props2, match) }} />
          </div>
        </Grid.Column>
      </Grid>
      <Divider />
    </List.Item>
  );

};

export default ReviewItem;
