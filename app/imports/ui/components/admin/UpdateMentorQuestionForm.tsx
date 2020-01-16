import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import BaseCollection from '../../../api/base/BaseCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';

interface IUpdateMentorQuestionFormProps {
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateMentorQuestionForm = (props: IUpdateMentorQuestionFormProps) => {
  const model = props.collection.findDoc(props.id);
  return (
    <Segment padded>
      <Header dividing>
Update
        {props.collection.getType()}
:
        {props.itemTitleString(model)}
      </Header>
      <AutoForm
        schema={MentorQuestions.getUpdateSchema()}
        onSubmit={props.handleUpdate}
        ref={props.formRef}
        showInlineError
        model={model}
      >
        <LongTextField name="question" />
        <LongTextField name="moderatorComments" />
        <Form.Group widths="equal">
          <BoolField name="moderated" />
          <BoolField name="visible" />
          <BoolField name="retired" />
        </Form.Group>
        <SubmitField inputRef={undefined} value="Update" disabled={false} className="" />
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateMentorQuestionForm;
