// this will be the column widget that holds the individual moderation cards
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { IMentorQuestion, IReview } from '../../../typings/radgrad';
import { Slugs } from "../../../api/slug/SlugCollection";
import { withTracker } from "meteor/react-meteor-data"; // eslint-disable-line
import { Grid, Header, Segment } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import AdminModerationReviewCardWidget from './AdminModerationReviewCardWidget'
import AdminModerationQuestionCardWidget from './AdminModerationQuestionCardWidget'
import Container from "semantic-ui-react/dist/commonjs/elements/Container";

interface IAdminModerationColumn {
  handleAccept:  (item) => any,
  handleReject: (item) => any,
  reviews: any,
  isReview: boolean,
  type: string

}

class AdminModerationColumnWidget extends React.Component<IAdminModerationColumn> {
  constructor(props) {
    super(props)
  }

  public render() {
    return (
      <div>
        <Segment>


          {
            this.props.isReview === true ? (
              <Container>
                <Header as='h4' textAlign='left' dividing>PENDING {this.props.type} REVIEWS </Header>
                {this.props.reviews.map((review, index) => <AdminModerationReviewCardWidget
                  key = {index}
                  item={review} handleAccept={this.props.handleAccept} handleReject={this.props.handleReject}/>)
                }
              </Container>

            ) : (
              <Container>
                <Header as='h4' textAlign='left' dividing> PENDING MENTORSPACE QUESTIONS</Header>
                <AdminModerationQuestionCardWidget question={this.props.reviews[0]} handleAccept={this.props.handleAccept}
                                                   handleReject={this.props.handleReject}/>
              </Container>
            )
          }

        </Segment>
      </div>
    )
  }
}


export default withRouter(AdminModerationColumnWidget);

