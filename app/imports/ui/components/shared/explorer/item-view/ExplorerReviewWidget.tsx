import React from 'react';
import Markdown from 'react-markdown';
import { Grid, Image, List } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { Users } from '../../../../../api/user/UserCollection';
import { Review } from '../../../../../typings/radgrad';
import StudentExplorerReviewStarsWidget from '../../../student/explorer/StudentExplorerReviewStarsWidget';
import RadGradHeader from '../../RadGradHeader';
import { academicTermNameToShortName } from '../../utilities/data-model';
import * as Router from '../../utilities/router';

interface ExplorerReviewWidgetProps {
  itemReviews: Review[];
  reviewType: string;
}

const reviewData = (review: { [key: string]: any }): { [key: string]: any } => {
  if (!review) return {};
  const profile = Users.getProfile(review.studentID);
  const userName = Users.getFullName(review.studentID);
  const userUsername = profile.username;
  const userPicture = profile.picture;
  const reviewTerm = review.termID;
  const reviewRating = review.rating;
  const reviewComments = review.comments;
  return {
    name: userName,
    username: userUsername,
    picture: userPicture,
    term: reviewTerm,
    rating: reviewRating,
    comments: reviewComments,
  };
};

const ExplorerReviewWidget: React.FC<ExplorerReviewWidgetProps> = ({ itemReviews, reviewType }) => {
  const commentsStyle = { paddingTop: '5px' };
  const match = useRouteMatch();
  return (
    <div className="ui padded container">
      <RadGradHeader title={`${reviewType} reviews`} dividing />
      <List verticalAlign="middle" relaxed="very" divided>
        {itemReviews ? (
          <React.Fragment>
            {itemReviews.map((review, index) => {
              const aReview = reviewData(review);
              return (
                <List.Item key={review._id}>
                  <Grid>
                    <Grid.Column width={4}>
                      <Image floated="left" verticalAlign="middle" circular size="mini" src={aReview.picture} />
                      <b>{aReview.name}</b>
                      <br />
                      {academicTermNameToShortName(aReview.term)}
                    </Grid.Column>

                    <Grid.Column width={12}>
                      <StudentExplorerReviewStarsWidget rating={aReview.rating} />
                      <br />
                      <div style={commentsStyle}>
                        <Markdown escapeHtml source={aReview.comments} renderers={{ link: (props2) => Router.renderLink(props2, match) }} />
                      </div>
                    </Grid.Column>
                  </Grid>
                </List.Item>
              );
            })}
          </React.Fragment>
        ) : (
          <i>No reviews to display</i>
        )}
      </List>
    </div>
  );
};

export default ExplorerReviewWidget;
