import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Grid, Container, Header, Card, Segment, Button } from 'semantic-ui-react';
import { Reviews } from '../../../api/review/ReviewCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { IMentorQuestion, IReview } from '../../../typings/radgrad';
import { withTracker } from 'meteor/react-meteor-data'; // eslint-disable-line
import AdminModerationColumnWidget from './AdminModerationColumnWidget'
import { Feeds } from '../../../api/feed/FeedCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { withRouter } from 'react-router-dom';


interface IAdminModerationWidget {
  item: {
    opportunityReviews: IReview[],
    courseReviews: IReview[],
    mentorQuestions: IMentorQuestion[],
  }
}

class AdminModerationWidget extends React.Component<IAdminModerationWidget> {
  constructor(props) {
    super(props);
    console.log('Admin Moderation Widget props constructor: ', props);
  }

  public render() {
    console.log('Admin Moderation Widget props: ', this.props);
    return (
      <Container>
        <Header>Hello World</Header>
        <AdminModerationColumnWidget/>
      </Container>
    )
  }
};

const AdminModerationWidgetContainer = withTracker((c) => ({
  opportunityReviews: Reviews.findNonRetired({ moderated: false, reviewType: 'opportunity' }),
  courseReviews: Reviews.findNonRetired({ moderated: false, reviewType: 'course' }),
  mentorQuestions: MentorQuestions.findNonRetired({ moderated: false }),
}))(AdminModerationWidget);

export default withRouter(AdminModerationWidgetContainer);
