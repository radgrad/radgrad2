// this will be the individual cards
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Grid, Divider, Container, Form, Button, Rating } from 'semantic-ui-react';
import { StudentProfiles } from "../../../api/user/StudentProfileCollection";
import { Courses } from "../../../api/course/CourseCollection";
import { Opportunities } from "../../../api/opportunity/OpportunityCollection";
import { AcademicTerms } from "../../../api/academic-term/AcademicTermCollection";

interface IAdminModerationReviewCardWidget {
  item: any;
  approve: (item) => any,
  deny: (item) => any,
}


class AdminModerationReviewCardWidget extends React.Component<IAdminModerationReviewCardWidget> {
  constructor(props) {
    super(props)
    console.log('Admin Moderation review card props constructor: ', props)
  }

  private getReviewee = () => {
    let reviewee;
    if (this.props.item.reviewType === 'course') {
      reviewee = Courses.findDoc(this.props.item.revieweeID);
    } else {
      reviewee = Opportunities.findDoc(this.props.item.revieweeID);
    }
    return reviewee;
  }

  public render() {
    // if findNonRetired and do not supply a selector, it will try do a find on that string
    const studentProfile = StudentProfiles.findDoc({ userID: this.props.item.studentID });
    const reviewee = this.getReviewee().name;
    const termDoc = AcademicTerms.findDoc(this.props.item.termID);
    console.log('student profile', studentProfile);
    console.log('review profile', reviewee);
    console.log('semester', termDoc);


    return (
      <div>
        <Container textAlign='left'>
          <Divider/>
          <b>Student: </b>{studentProfile.firstName} {studentProfile.lastName}<br/>
          <b>Reviewee: </b>{reviewee}<br/>
          <b>Semester: </b> {termDoc.term + ' ' + termDoc.year} <br/>
          <b>Rating: </b>
          <Rating size='small' icon='star' rating={this.props.item.rating}
                  maxRating='5' disabled={true}/><br/>
          <b>Comments: </b>{this.props.item.comments}<br/>
          <Segment>
            <Form>
              <Form.Field>
                <label>
                  Moderator Comments:
                </label>
                <input/>
              </Form.Field>
            </Form>
            <Button.Group size='tiny'>
              <Button onClick={this.props.approve}>approve</Button>
              <Button onClick={this.props.deny}>deny</Button>
            </Button.Group>
          </Segment>

        </Container>
      </div>
    )
  }
}

export default withRouter(AdminModerationReviewCardWidget);
