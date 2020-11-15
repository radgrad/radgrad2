import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { HelpMessages } from '../../../../../api/help/HelpMessageCollection';

interface IAddHelpMessageFormProps {
  formRef: any;
  handleAdd: (doc) => any;
}

const AddHelpMessageForm = (props: IAddHelpMessageFormProps) => (
  <Segment padded>
    <Header dividing>Add Help Message</Header>
    <AutoForm schema={new SimpleSchema2Bridge(HelpMessages.getDefineSchema())} onSubmit={props.handleAdd} ref={props.formRef} showInlineError>
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
