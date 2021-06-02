import React, { useState } from 'react';
import { Segment, Container, Form, Button, Rating } from 'semantic-ui-react';
import RadGradAlert from '../../../utilities/RadGradAlert';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Users } from '../../../../api/user/UserCollection';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';

interface ModerationReviewCardWidget {
  item: any; // TODO can we type this?
  handleAccept: (item, comment) => any;
  handleReject: (item, comment) => any;
}

const ModerationReviewCardWidget: React.FC<ModerationReviewCardWidget> = ({ item, handleAccept, handleReject }) => {
  const [moderatorCommentState, setModeratorComment] = useState('');

  const getReviewee = () => {
    let reviewee;
    if (item.reviewType === 'course') {
      reviewee = Courses.findDoc(item.revieweeID);
    } else {
      reviewee = Opportunities.findDoc(item.revieweeID);
    }
    return reviewee;
  };

  const handleAcceptClick = () => {
    // make handle accept take in the moderator comments
    const update = handleAccept(item, moderatorCommentState);
    setModeratorComment('');
    // console.log('handle accept click', update);
    updateMethod.callPromise({ collectionName: update.collectionName, updateData: update.updateInfo })
      .catch((error) => { RadGradAlert.failure('Update Failed', error.message, error);})
      .then(() => { RadGradAlert.success('Update Succeeded');});
  };

  const handleRejectClick = () => {
    const update = handleReject(item, moderatorCommentState);
    setModeratorComment('');
    // console.log('handle accept click', update);
    updateMethod.callPromise({ collectionName: update.collectionName, updateData: update.updateInfo })
      .catch((error) => { RadGradAlert.failure('Update Failed', error.message, error);})
      .then(() => { RadGradAlert.success('Update Succeeded');});
  };

  const handleChange = (event, { value }) => {
    setModeratorComment(value);
  };

  // if findNonRetired and do not supply a selector, it will try do a find on that string
  const student = Users.getFullName(item.studentID);
  const reviewee = getReviewee().name;
  const termDoc = AcademicTerms.findDoc(item.termID);

  return (
    <Container textAlign="left">
      <strong>Student: </strong>
      {student}
      <br />
      <strong>Reviewee: </strong>
      {reviewee}
      <br />
      <strong>Semester: </strong> {`${termDoc.term}  ${termDoc.year}`} <br />
      <strong>Rating: </strong>
      <Rating size="small" icon="star" rating={item.rating} maxRating="5" disabled />
      <br />
      <strong>Comments: </strong>
      {item.comments}
      <br />
      <Segment>
        <Form>
          <Form.TextArea label="Moderator Comments" onChange={handleChange} value={moderatorCommentState} />
          <Button className="ui basic green mini button" onClick={handleAcceptClick}>
            ACCEPT
          </Button>
          <Button className="ui basic red mini button" onClick={handleRejectClick}>
            REJECT
          </Button>
        </Form>
      </Segment>
    </Container>
  );
};

export default ModerationReviewCardWidget;
