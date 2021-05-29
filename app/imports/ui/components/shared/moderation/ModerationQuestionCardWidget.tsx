import React, { useState } from 'react';
import { Button, Container, Segment, Form } from 'semantic-ui-react';
import RadGradAlerts from '../../../utilities/RadGradAlert';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';

interface ModerationQuestionCardWidget {
  question: any; // TODO isn't this a string?
  handleAccept: (item, comments) => any;
  handleReject: (item, comments) => any;
}

const ModerationQuestionCardWidget: React.FC<ModerationQuestionCardWidget> = ({ question, handleReject, handleAccept }) => {
  const RadGradAlert = new RadGradAlerts();
  const [moderatorCommentState, setModeratorComment] = useState('');

  const handleAcceptClick = () => {
    const update = handleAccept(question, moderatorCommentState);
    setModeratorComment('');
    // console.log('handle accept click', update);
    updateMethod.call({ collectionName: update.collectionName, updateData: update.updateInfo }, (error) => {
      if (error) {
        RadGradAlert.failure('Update failed', error.message, 2500, error);
      } else {
        RadGradAlert.success('Update succeeded', 1500);
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
        RadGradAlert.failure('Update failed', error.message, 2500, error);
      } else {
        RadGradAlert.success('Update succeeded', 1500);
      }
    });
  };

  return (
    <Container textAlign="left">
      <strong>Question:</strong> {question.question}
      <Segment>
        <Form>
          <Form.TextArea label="Moderator Comments" value={moderatorCommentState} onChange={handleChange} />
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

export default ModerationQuestionCardWidget;
