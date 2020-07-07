import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Accordion, Icon, Form, Button, Grid, Confirm } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { IMentorQuestion } from '../../../typings/radgrad';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Users } from '../../../api/user/UserCollection';

interface IMentorMentorSpaceAnswerFormProps {
  question: IMentorQuestion;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      opportunity: string;
    }
  };
}

const MentorMentorSpaceAnswerForm = (props: IMentorMentorSpaceAnswerFormProps) => {
  const getUserIdFromRoute = () => {
    const username = props.match.params.username;
    return username && Users.getID(username);
  };

  const existingAnswer = () => {
    const questionID = props.question._id;
    const existingAnswers = MentorAnswers.findNonRetired({ questionID, mentorID: getUserIdFromRoute() });
    return (existingAnswers.length > 0) ? existingAnswers[0].text : '';
  };

  const [activeIndexState, setActiveIndex] = useState(-1);
  const [textAreaState, setTextArea] = useState(existingAnswer());
  const [confirmOpenState, setConfirmOpen] = useState(false);

  const handleEdit = (e, { value }) => {
    setTextArea(value);
  };

  const handleSubmit = (doc) => {
    doc.preventDefault();
    const answer = textAreaState;
    const question = props.question._id;
    const collectionName = MentorAnswers.getCollectionName();
    const newAnswer: any = { question, mentor: getUserIdFromRoute(), text: answer };
    const existingAnswers = MentorAnswers.findNonRetired({ questionID: question, mentorID: getUserIdFromRoute() });
    const answerExists = (existingAnswers.length > 0);
    if (answerExists) {
      newAnswer.id = existingAnswers[0]._id;
      updateMethod.call({ collectionName, updateData: newAnswer }, (error) => {
        if (error) {
          Swal.fire({
            title: 'Failed to update Mentor Answer',
            text: error.message,
            icon: 'error',
          });
        } else {
          Swal.fire({
            title: 'Mentor Answer Updated',
            icon: 'success',
            text: 'Your answer has been successfully updated.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
          });
        }
      });
    } else {
      defineMethod.call({ collectionName, definitionData: newAnswer }, (error) => {
        if (error) {
          Swal.fire({
            title: 'Failed to create Mentor Answer',
            text: error.message,
            icon: 'error',
          });
        } else {
          Swal.fire({
            title: 'Mentor Answer Submitted',
            icon: 'success',
            text: 'Your answer has been successfully submitted.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
          });
        }
      });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setConfirmOpen(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    const questionID = props.question._id;
    const collectionName = MentorAnswers.getCollectionName();
    const instance = MentorAnswers.findDoc({ questionID, mentorID: getUserIdFromRoute() })._id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Delete failed',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Deleted Mentor Answer',
          icon: 'success',
          text: 'Your answer has been successfully deleted.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
        setTextArea('');
      }
      setConfirmOpen(false);
    });
  };

  const handleClick = (e, titleProps) => {
    e.preventDefault();
    const { index } = titleProps;
    const newIndex = activeIndexState === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const accordionStyle = { overflow: 'hidden' };
  return (
    <div>
      <Accordion fluid styled style={accordionStyle} key={0}>
        <Accordion.Title active={activeIndexState === 0} index={0} onClick={handleClick}>
          <Icon name="dropdown" /> Add or update your answer (markdown supported)
        </Accordion.Title>
        <Accordion.Content active={activeIndexState === 0}>
          <Form>
            <Form.TextArea
              onChange={handleEdit}
              value={textAreaState}
              id="msanswer"
              name="msanswer"
              style={{ minHeight: 175 }}
            />
          </Form>
          <br />
          <Grid.Row>
            <Button basic color="green" content="Submit" onClick={handleSubmit} />
            {
              existingAnswer() ?
                <Button basic color="red" content="Delete" onClick={handleDelete} />
                : ''
            }
          </Grid.Row>
        </Accordion.Content>
      </Accordion>
      <Confirm
        open={confirmOpenState}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        header="Delete Answer?"
      />
    </div>
  );
};

export default withRouter(MentorMentorSpaceAnswerForm);
