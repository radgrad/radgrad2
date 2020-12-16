import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Button, Container, Segment, Form } from 'semantic-ui-react';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';

interface ModerationQuestionCardWidget {
  question: any; // TODO isn't this a string?
  handleAccept: (item, comments) => any;
  handleReject: (item, comments) => any;
}

const ModerationQuestionCardWidget: React.FC<ModerationQuestionCardWidget> = ({ question, handleReject, handleAccept }) => {
  const [moderatorCommentState, setModeratorComment] = useState('');

  const handleAcceptClick = () => {
    const update = handleAccept(question, moderatorCommentState);
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

  const handleRejectClick = () => {
    const update = handleReject(question, moderatorCommentState);
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

  return (
    <Container textAlign="left">
      <strong>Question:</strong> {question.question}
      <Segment>
        <Form>
          <Form.TextArea label="Moderator Comments" value={moderatorCommentState} onChange={handleChange} />
          <Button className="ui basic green mini button" onClick={handleAcceptClick}>ACCEPT</Button>
          <Button className="ui basic red mini button" onClick={handleRejectClick}>REJECT</Button>
        </Form>
      </Segment>
    </Container>
  );
};

export default ModerationQuestionCardWidget;
