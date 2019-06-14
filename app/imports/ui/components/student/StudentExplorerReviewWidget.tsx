import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Grid, Header, Image, List } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import * as _ from 'lodash';
import { Users } from '../../../api/user/UserCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import StudentExplorerReviewStarsWidget from './StudentExplorerReviewStarsWidget';
import { Reviews } from '../../../api/review/ReviewCollection';
import StudentExplorerEditReviewForm from './StudentExplorerEditReviewForm';

interface IStudentExplorerReviewWidgetProps {
  event: {
    [key: string]: any;
  }
  userReview: {
    [key: string]: any;
  };
  completed: boolean;
  reviewType: string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      course: string;
    }
  };
}

class StudentExplorerReviewWidget extends React.Component<IStudentExplorerReviewWidgetProps> {
  constructor(props) {
    super(props);
  }

  private reviewData = (review: { [key: string]: any }): { [key: string]: any } => {
    if (!review) return {};

    const profile = Users.getProfile(review.studentID);
    const userName = Users.getFullName(review.studentID);
    const userUsername = profile.username;
    const userPicture = profile.picture;
    const reviewTerm = AcademicTerms.toString(review.termID);
    const reviewRating = review.rating;
    const reviewComments = review.comments;
    return {
      name: userName, username: userUsername, picture: userPicture, term: reviewTerm,
      rating: reviewRating, comments: reviewComments,
    };
  }

  private abbreviateTerm = (term: string): string => {
    const termNameYear = term.split(' ');
    let termName = '';
    switch (termNameYear[0]) {
      case 'Spring':
        termName = 'Spr';
        break;
      case 'Fall':
        termName = 'Fall';
        break;
      case 'Summer':
        termName = 'Sum';
        break;
      default:
        termName = 'N/A';
        break;
    }
    return `${termName} ${termNameYear[1]}`;
  }

  private getUsername = () => this.props.match.params.username;

  private getUserIdFromRoute = (): string => {
    const username = this.getUsername();
    return username && Users.getID(username);
  }

  private currentUserPicture = (): string => Users.getProfile(this.getUserIdFromRoute()).picture;

  private currentUserName = (): string => Users.getFullName(this.getUserIdFromRoute());

  private reviews = (): object[] => {
    const event = this.props.event;
    const matchingReviews = Reviews.find({
      revieweeID: event._id,
      visible: true,
    }).fetch();
    const matchingReviewsFinal = _.filter(matchingReviews, (review) => {
      let ret = true;
      if (review.studentID === this.getUserIdFromRoute()) {
        ret = false;
      }
      return ret;
    });
    return matchingReviewsFinal;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const uppercaseStyle = { textTransform: 'uppercase' };
    const commentsStyle = { paddingTop: '5px' };

    const { event, userReview, completed, reviewType } = this.props;
    const { name, picture, term, rating, comments } = this.reviewData(userReview);
    const currentUserPicture = this.currentUserPicture();
    const currentUserName = this.currentUserName();
    const reviews = this.reviews();

    return (
      <div className="ui padded container">
        <Header as="h4" dividing={true} style={uppercaseStyle}>
          {reviewType} REVIEWS
        </Header>

        <List verticalAlign="middle" relaxed="very" divided={true}>
          {
            userReview ?
              <List.Item>
                <Grid>
                  <Grid.Column width={4}>
                    <Image floated="left" verticalAlign="middle" circular={true} size="mini" src={picture}/>
                    <Link to={'/explorer/users'}>{name}</Link>
                    <br/>
                    {this.abbreviateTerm(term)}
                  </Grid.Column>

                  <Grid.Column width={12}>
                    <StudentExplorerReviewStarsWidget rating={rating}/>
                    <br/>
                    <div style={commentsStyle}>
                      <Markdown escapeHtml={true} source={comments}/>
                    </div>
                  </Grid.Column>
                </Grid>

                <StudentExplorerEditReviewForm review={userReview} event={event}/>

              </List.Item>
              :
              <List.Item>
                <Grid>
                  <Grid.Column width={4}>
                    <Image floated="left" verticalAlign="middle" circular={true} size="mini" src={currentUserPicture}/>
                    <Link to={'/explorer/users'}>{currentUserName}</Link>
                  </Grid.Column>

                  <Grid.Column width={12}>
                    {
                      completed ?
                        <p><i>You have not reviewed this yet.</i></p>
                        :
                        <p><i>You must complete this {reviewType} first to leave a review.</i></p>
                    }
                  </Grid.Column>
                </Grid>
                {
                  completed ?
                    <div/>
                    //    TODO: <StudentExplorerAddReviewWidget event={event} reviewType={reviewType}/>
                    : ''
                }
              </List.Item>
          }

          {
            reviews ?
              <React.Fragment>
                {
                  reviews.map((review, index) => {
                    const aReview = this.reviewData(review);
                    return (
                      <List.Item key={index}>
                        <Grid>
                          <Grid.Column width={4}>
                            <Image floated="left" verticalAlign="middle" circular={true} size="mini"
                                   src={aReview.picture}/>
                            <Link to={'/explorer/users'}>{aReview.name}</Link>
                            <br/>
                            {this.abbreviateTerm(aReview.term)}
                          </Grid.Column>

                          <Grid.Column width={12}>
                            <StudentExplorerReviewStarsWidget rating={aReview.rating}/>
                            <br/>
                            <div style={commentsStyle}>
                              <Markdown escapeHtml={true} source={aReview.comments}/>
                            </div>
                          </Grid.Column>
                        </Grid>
                      </List.Item>
                    );
                  })
                }
              </React.Fragment>
              :
              <i>No reviews to display</i>
          }
        </List>
      </div>
    );
  }
}


export default withRouter(StudentExplorerReviewWidget);
