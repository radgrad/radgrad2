import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Grid, Header, Image, List } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import _ from 'lodash';
import { Users } from '../../../../api/user/UserCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import StudentExplorerReviewStarsWidget from './StudentExplorerReviewStarsWidget';
import { Reviews } from '../../../../api/review/ReviewCollection';
import StudentExplorerEditReviewForm from './StudentExplorerEditReviewForm';
import StudentExplorerAddReviewForm from './StudentExplorerAddReviewForm';
import * as Router from '../../shared/utilities/router';
import {
  profileIDToPicture,
  userToFullName,
  academicTermNameToShortName,
} from '../../shared/utilities/data-model';
import { IReview } from '../../../../typings/radgrad';

interface IStudentExplorerReviewWidgetProps {
  event: any;
  userReview: IReview;
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
    name: userName, username: userUsername, picture: userPicture, term: reviewTerm,
    rating: reviewRating, comments: reviewComments,
  };
};

// TODO make this responsive.
const reviews = (props: IStudentExplorerReviewWidgetProps, match): IReview[] => {
  const event = props.event;
  const matchingReviews = Reviews.findNonRetired({
    revieweeID: event._id,
    visible: true,
  });
  const matchingReviewsFinal = _.filter(matchingReviews, (review) => {
    let ret = true;
    if (review.studentID === Router.getUserIdFromRoute(match)) {
      ret = false;
    }
    return ret;
  });
  return matchingReviewsFinal;
};

const StudentExplorerReviewWidget = (props: IStudentExplorerReviewWidgetProps) => {
  const match = useRouteMatch();
  const uppercaseStyle = { textTransform: 'uppercase' };
  const commentsStyle = { paddingTop: '5px' };

  const { event, userReview, completed, reviewType } = props;
  const { name, picture, term, rating, comments } = reviewData(userReview);
  const currentUserPicture = profileIDToPicture(Router.getUserIdFromRoute(match));
  const currentUserName = userToFullName(Router.getUsername(match));
  const theReviews = reviews(props, match);
  return (
    <div className="ui padded container">
      <Header as="h4" dividing style={uppercaseStyle}>
        {reviewType} REVIEWS
      </Header>

      <List verticalAlign="middle" relaxed="very" divided>
        {
          userReview ? (
            <List.Item>
              <Grid>
                <Grid.Column width={4}>
                  <Image floated="left" verticalAlign="middle" circular size="mini" src={picture} />
                  <b>{name}</b>
                  <br />
                  {AcademicTerms.getShortName(term)}
                </Grid.Column>

                <Grid.Column width={12}>
                  <StudentExplorerReviewStarsWidget rating={rating} />
                  <br />
                  <div style={commentsStyle}>
                    <Markdown
                      escapeHtml
                      source={comments}
                      renderers={{ link: (props2) => Router.renderLink(props2, match) }}
                    />
                  </div>
                </Grid.Column>
              </Grid>

              <StudentExplorerEditReviewForm review={userReview} event={event} />

            </List.Item>
          )
            : (
              <List.Item>
                <Grid>
                  <Grid.Column width={4}>
                    <Image floated="left" verticalAlign="middle" circular size="mini" src={currentUserPicture} />
                    <b>{currentUserName}</b>
                  </Grid.Column>

                  <Grid.Column width={12}>
                    {
                      completed ?
                        <p><i>You have not reviewed this yet.</i></p>
                        : (
                          <p>
                            <i>
                              You must complete this {` ${reviewType}`} first to leave a review.
                            </i>
                          </p>
                        )
                    }
                  </Grid.Column>
                </Grid>
                {
                  completed ?
                    <StudentExplorerAddReviewForm event={event} reviewType={reviewType} />
                    : ''
                }
              </List.Item>
            )
        }

        {
          theReviews ? (
            <React.Fragment>
              {
                  theReviews.map((review, index) => {
                    const aReview = reviewData(review);
                    return (
                      <List.Item key={review._id}>
                        <Grid>
                          <Grid.Column width={4}>
                            <Image
                              floated="left"
                              verticalAlign="middle"
                              circular
                              size="mini"
                              src={aReview.picture}
                            />
                            <b>{aReview.name}</b>
                            <br />
                            {academicTermNameToShortName(aReview.term)}
                          </Grid.Column>

                          <Grid.Column width={12}>
                            <StudentExplorerReviewStarsWidget rating={aReview.rating} />
                            <br />
                            <div style={commentsStyle}>
                              <Markdown
                                escapeHtml
                                source={aReview.comments}
                                renderers={{ link: (props2) => Router.renderLink(props2, match) }}
                              />
                            </div>
                          </Grid.Column>
                        </Grid>
                      </List.Item>
                    );
                  })
                }
            </React.Fragment>
          )
            :
            <i>No reviews to display</i>
        }
      </List>
    </div>
  );
};

export default StudentExplorerReviewWidget;
