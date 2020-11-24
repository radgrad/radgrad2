import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Segment, Container, Form, Button, Rating } from 'semantic-ui-react';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Users } from '../../../../api/user/UserCollection';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';

interface IModerationReviewCardWidget {
  item: any;
  handleAccept: (item, comment) => any,
  handleReject: (item, comment) => any,
}

const ModerationReviewCardWidget = (props: IModerationReviewCardWidget) => {
  const [moderatorCommentState, setModeratorComment] = useState('');

  const getReviewee = () => {
    let reviewee;
    if (props.item.reviewType === 'course') {
      reviewee = Courses.findDoc(props.item.revieweeID);
    } else {
      reviewee = Opportunities.findDoc(props.item.revieweeID);
    }
    return reviewee;
  };

  const handleAcceptClick = () => {
    // make handle accept take in the moderator comments
    const update = props.handleAccept(props.item, moderatorCommentState);
    setModeratorComment('');
    // console.log('handle accept click', update);
    updateMethod.call({ collectionName: update.collectionName, updateData: update.updateInfo }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleRejectClick = () => {
    const update = props.handleReject(props.item, moderatorCommentState);
    setModeratorComment('');
    // console.log('handle accept click', update);
    updateMethod.call({ collectionName: update.collectionName, updateData: update.updateInfo }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleChange = (event, { value }) => {
    setModeratorComment(value);
  };

  // if findNonRetired and do not supply a selector, it will try do a find on that string
  const student = Users.getFullName(props.item.studentID);
  const reviewee = getReviewee().name;
  const termDoc = AcademicTerms.findDoc(props.item.termID);

  return (

    <Container textAlign="left">
      <strong>Student: </strong>
      {student}
      <br />
      <strong>Reviewee: </strong>
      {reviewee}
      <br />
      <strong>Semester: </strong>
      {' '}
      {`${termDoc.term}  ${termDoc.year}`}
      {' '}
      <br />
      <strong>Rating: </strong>
      <Rating
        size="small"
        icon="star"
        rating={props.item.rating}
        maxRating="5"
        disabled
      />
      <br />
      <strong>Comments: </strong>
      {props.item.comments}
      <br />
      <Segment>
        <Form>
          <Form.TextArea
            label="Moderator Comments"
            onChange={handleChange}
            value={moderatorCommentState}
          />
          <Button className="ui basic green mini button" onClick={handleAcceptClick}>ACCEPT</Button>
          <Button className="ui basic red mini button" onClick={handleRejectClick}>REJECT</Button>
        </Form>
      </Segment>
    </Container>

  );
};

export default ModerationReviewCardWidget;
