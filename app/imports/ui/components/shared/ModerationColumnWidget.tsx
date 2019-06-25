// this will be the column widget that holds the individual moderation cards
import * as React from 'react';
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

class ModerationColumnWidget extends React.Component<IModerationColumn> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div>
        <Segment>
          <Header as='h4' textAlign='left' dividing>PENDING {this.props.type} REVIEWS </Header>
          {this.props.isReview && this.props.reviews.length > 0 ?
            <Item.Group divided>
              {this.props.reviews.map((review, index) => <Item key={index}> <ModerationReviewCardWidget
                item={review} handleAccept={this.props.handleAccept}
                handleReject={this.props.handleReject}/></Item>)
              }
            </Item.Group>
            :
            <React.Fragment>
              {
                (this.props.isReview === false && this.props.reviews.length > 0) ?
                  <Item.Group divided>
                    {this.props.reviews.map((question, index) => <Item key={index}> <ModerationQuestionCardWidget
                      question={question} handleAccept={this.props.handleAccept}
                      handleReject={this.props.handleReject}/></Item>)
                    }
                  </Item.Group>
                  :
                  <Container textAlign='left'>
                    <i>No pending {this.props.type.toLowerCase()} reviews</i>
                  </Container>
              }
            </React.Fragment>
          }

        </Segment>
      </div>
    );
  }
}

export default withRouter(ModerationColumnWidget);
