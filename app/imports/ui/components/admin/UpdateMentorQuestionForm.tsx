import * as React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'; // eslint-disable-line no-unused-vars
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line
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
    <Segment padded={true}>
      <Header dividing={true}>Update {props.collection.getType()}: {props.itemTitleString(model)}</Header>
      <AutoForm schema={MentorQuestions.getUpdateSchema()} onSubmit={props.handleUpdate} ref={props.formRef}
                showInlineError={true} model={model}>
        <LongTextField name="question"/>
        <LongTextField name="moderatorComments"/>
        <Form.Group widths="equal">
          <BoolField name="moderated"/>
          <BoolField name="visible"/>
          <BoolField name="retired"/>
        </Form.Group>
        <SubmitField/>
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateMentorQuestionForm;
