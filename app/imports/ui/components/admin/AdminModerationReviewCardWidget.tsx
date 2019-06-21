// this will be the individual cards
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Grid, Divider, Container, Form, Button, Rating } from 'semantic-ui-react';
import { StudentProfiles } from "../../../api/user/StudentProfileCollection";
import { Courses } from "../../../api/course/CourseCollection";
import { Opportunities } from "../../../api/opportunity/OpportunityCollection";
import { AcademicTerms } from "../../../api/academic-term/AcademicTermCollection";
import { Users } from "../../../api/user/UserCollection";
import { updateMethod } from "../../../api/base/BaseCollection.methods";
import Swal from "sweetalert2";

interface IAdminModerationReviewCardWidget {
  item: any;
  handleAccept: (item, comment) => any,
  handleReject: (item, comment) => any,
}

interface IAdminModerationReviewCardState {
  moderatorComment: string;
}

class AdminModerationReviewCardWidget extends React.Component<IAdminModerationReviewCardWidget, IAdminModerationReviewCardState> {
  constructor(props) {
    super(props)
    this.state = { moderatorComment: '' };
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

  private handleAcceptClick = () => {
    // make handle accept take in the moderator comments
    const update = this.props.handleAccept(this.props.item, this.state);
    this.setState({moderatorComment: ''});
    console.log('handle accept click', update);
    updateMethod.call({ collectionName: update.collectionName, updateData: update.updateInfo }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          type: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    })
  }

  private handleRejectClick = () => {
    const update = this.props.handleReject(this.props.item, this.state);
    this.setState({moderatorComment: ''});
    console.log('handle accept click', update);
    updateMethod.call({ collectionName: update.collectionName, updateData: update.updateInfo }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          type: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    })
  }


  private handleChange = (event, { value }) => {
    this.setState({ moderatorComment: value });
  }

  public render() {
    // if findNonRetired and do not supply a selector, it will try do a find on that string
    const student = Users.getFullName(this.props.item.studentID);
    const reviewee = this.getReviewee().name;
    const termDoc = AcademicTerms.findDoc(this.props.item.termID);

    return (
      <div>
        <Grid.Column>
          <Container textAlign='left'>
            <strong>Student: </strong>{student}<br/>
            <strong>Reviewee: </strong>{reviewee}<br/>
            <strong>Semester: </strong> {termDoc.term + ' ' + termDoc.year} <br/>
            <strong>Rating: </strong>
            <Rating size='small' icon='star' rating={this.props.item.rating}
                    maxRating='5' disabled={true}/><br/>
            <strong>Comments: </strong>{this.props.item.comments}<br/>
            <Segment>
              <Form>
                <Form.TextArea label='Moderator Comments' onChange={this.handleChange} value={this.state.moderatorComment}/>
                <Button className='ui basic green mini button' onClick={this.handleAcceptClick}>ACCEPT</Button>
                <Button className='ui basic red mini button' onClick={this.handleRejectClick}>REJECT</Button>
              </Form>
            </Segment>
            <Divider/>
          </Container>
        </Grid.Column>
      </div>

    )
  }
}

export default withRouter(AdminModerationReviewCardWidget);
