import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Grid, List } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { Users } from '../../../../api/user/UserCollection';

import RadGradHeader from '../../shared/RadGradHeader';
import StudentExplorerReviewStarsWidget from './StudentExplorerReviewStarsWidget';
import StudentExplorerEditReviewForm from './StudentExplorerEditReviewForm';
import StudentExplorerAddReviewForm from './StudentExplorerAddReviewForm';
import * as Router from '../../shared/utilities/router';
import { Review } from '../../../../typings/radgrad';
import UserLabel from '../../shared/profile/UserLabel';
import { EXPLORER_TYPE_ICON } from '../../../utilities/ExplorerUtils';

interface StudentExplorerReviewWidgetProps {
  itemToReview: any;
  userReview: Review;
  itemReviews: Review[];
  completed: boolean;
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

const StudentExplorerReviewWidget: React.FC<StudentExplorerReviewWidgetProps> = ({ itemReviews, userReview, completed, reviewType, itemToReview }) => {
  const match = useRouteMatch();
  const commentsStyle = { paddingTop: '5px' };

  const {  rating, comments, username } = reviewData(userReview);
  const currentUserName = Router.getUsername(match);
  let theReviews = itemReviews;
  if (userReview) {
    theReviews = theReviews.filter((review) => review._id !== userReview._id && review.visible);
  } else {
    theReviews = theReviews.filter((review) => review.visible);
  }
  let icon = '';
  switch (reviewType) {
    case 'course':
      icon = EXPLORER_TYPE_ICON.COURSE;
      break;
    case 'opportunity':
      icon = EXPLORER_TYPE_ICON.OPPORTUNITY;
      break;
    default:
  }
  return (
    <div className="ui padded container">
      <RadGradHeader icon={icon} title={`${reviewType} reviews`} dividing />

      <List verticalAlign="middle" relaxed="very" divided>
        {userReview ? (
          <List.Item>
            <Grid>
              <Grid.Column width={5}>
                <UserLabel username={username} size='medium' />
              </Grid.Column>

              <Grid.Column width={11}>
                <StudentExplorerReviewStarsWidget rating={rating} />
                <br />
                <div style={commentsStyle}>
                  <Markdown escapeHtml source={comments} renderers={{ link: (props2) => Router.renderLink(props2, match) }} />
                </div>
              </Grid.Column>
            </Grid>

            <StudentExplorerEditReviewForm review={userReview} itemToReview={itemToReview} />
          </List.Item>
        ) : (
          <List.Item>
            <Grid>
              <Grid.Column width={5}>
                <UserLabel username={currentUserName} size='medium' />
              </Grid.Column>

              <Grid.Column width={11}>
                {completed ? (
                  <p>
                    <i>You have not reviewed this yet.</i>
                  </p>
                ) : (
                  <p>
                    <i>You must complete this {` ${reviewType}`} first to leave a review.</i>
                  </p>
                )}
              </Grid.Column>
            </Grid>
            {completed ? <StudentExplorerAddReviewForm itemToReview={itemToReview} reviewType={reviewType} /> : ''}
          </List.Item>
        )}

        {theReviews.length > 0 ? (
          <React.Fragment>
            {theReviews.map((review, index) => {
              const aReview = reviewData(review);
              return (
                <List.Item key={review._id}>
                  <Grid>
                    <Grid.Column width={5}>
                      <UserLabel username={aReview.username} size='medium' />
                    </Grid.Column>

                    <Grid.Column width={11}>
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
          <p>
            <i>No reviews to display</i>
          </p>
        )}
      </List>
    </div>
  );
};

export default StudentExplorerReviewWidget;
