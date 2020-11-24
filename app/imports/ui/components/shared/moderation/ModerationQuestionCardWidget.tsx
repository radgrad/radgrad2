import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Button, Container, Segment, Form } from 'semantic-ui-react';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';

interface IModerationQuestionCardWidget {
  question: any;
  handleAccept: (item, comments) => any;
  handleReject: (item, comments) => any;
}

const ModerationQuestionCardWidget = (props: IModerationQuestionCardWidget) => {
  const [moderatorCommentState, setModeratorComment] = useState('');

  const handleAcceptClick = () => {
    const update = props.handleAccept(props.question, moderatorCommentState);
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
    const update = props.handleReject(props.question, moderatorCommentState);
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
      <strong>Question:</strong> {props.question.question}
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
