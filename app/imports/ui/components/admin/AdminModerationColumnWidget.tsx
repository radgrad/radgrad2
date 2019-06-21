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
  handleAccept: (item, comment) => any,
  handleReject: (item, comment) => any,
  reviews: any,
  isReview: boolean,
  type: string

}

class AdminModerationColumnWidget extends React.Component<IAdminModerationColumn> {
  constructor(props) {
    super(props)
  }

  public render() {
    console.log('how many reviews? ',this.props.reviews.length);
    return (
      <div>
        <Segment>
          <Header as='h4' textAlign='left' dividing>PENDING {this.props.type} REVIEWS </Header>
          {this.props.isReview && this.props.reviews.length > 0 ? (
                <Container>
                {this.props.reviews.map((review, index) => <AdminModerationReviewCardWidget
                  key={index}
                  item={review} handleAccept={this.props.handleAccept} handleReject={this.props.handleReject}/>)
                }
                </Container>

            ) :
            (this.props.isReview === false && this.props.reviews.length) > 0 ?(
                <Container>
                  {this.props.reviews.map((review, index) => <AdminModerationQuestionCardWidget
                    key={index}
                    item={review} handleAccept={this.props.handleAccept} handleReject={this.props.handleReject}/>)
                  }
                </Container>
              ):
            (
              <Container>
                <i>No pending {this.props.type.toLowerCase()} reviews</i>
              </Container>
            )

          }


        </Segment>
      </div>
    )
  }
}


export default withRouter(AdminModerationColumnWidget);

