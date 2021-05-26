// @ts-ignore
import React from 'react';
// @ts-ignore
import { Form, Header, Segment } from 'semantic-ui-react';
// @ts-ignore
import { AutoForm, TextField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
// @ts-ignore
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
// @ts-ignore
import { HelpMessages } from '../../../../../api/help/HelpMessageCollection';

interface AddHelpMessageFormProps {
  formRef: React.RefObject<unknown>;
  handleAdd: (doc) => any;
}

const AddHelpMessageForm: React.FC<AddHelpMessageFormProps> = ({ formRef, handleAdd }) => (
  <Segment padded>
    <Header dividing>Add Help Message</Header>
    <AutoForm schema={new SimpleSchema2Bridge(HelpMessages.getDefineSchema())} onSubmit={handleAdd} ref={formRef} showInlineError>
      <Form.Group widths="equal">
        <TextField name="routeName" />
        <TextField name="title" />
      </Form.Group>
      <LongTextField name="text" />
      <BoolField name="retired" />
      <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined} />
    </AutoForm>
  </Segment>
);

export default AddHelpMessageForm;
