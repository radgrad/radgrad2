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
  handleApprove: (item) => any,
  handleDeny: (item) => any,
  reviews: any,
  isReview: boolean,

}

class AdminModerationColumnWidget extends React.Component<IAdminModerationColumn> {
  constructor(props) {
    super(props)
    console.log('Admin Moderation Column Widget props constructor: ', props)
  }

  public render() {
    return (
      <div>
        <Segment>


          {
            this.props.isReview === true ? (
              <Container>
                <Header as='h4'>PENDING {this.props.reviews[0].reviewType} REVIEWS </Header>
                <AdminModerationReviewCardWidget item={this.props.reviews[0]} approve={this.props.handleApprove}
                                                 deny={this.props.handleDeny}/>
              </Container>

            ) : (
              <Container>
                <Header as='h4'> PENDING MENTORSPACE QUESTIONS</Header>
                <AdminModerationQuestionCardWidget question={this.props.reviews[0]} approve={this.props.handleApprove}
                                                   deny={this.props.handleDeny}/>
              </Container>
            )
          }

        </Segment>
      </div>
    )
  }
}


export default withRouter(AdminModerationColumnWidget);

