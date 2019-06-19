import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Grid, Container, Header, Card, Segment, Button } from 'semantic-ui-react';
import { Reviews } from '../../../api/review/ReviewCollection';
import { MentorQuestions } from "../../../api/mentor/MentorQuestionCollection";
import { updateMethod } from "../../../api/base/BaseCollection.methods";
import { IReviewUpdateData, IMentorQuestion } from '../../../typings/radgrad'; // eslint-disable-line


interface IAdminModerationWidget {
  item: {
    mentorQuestion: IMentorQuestion[];
  }
  // opportunity, course review or mentor question
}

class AdminModerationWidget extends React.Component<IAdminModerationWidget> {
  constructor(props) {
    super(props);
    console.log(props);
  }

  public render() {
    console.log(this.props)
    return (
      <Container>
        <Header>Hello World</Header>
      </Container>
    )
  }

};

export default withRouter(AdminModerationWidget);

