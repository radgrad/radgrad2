import * as React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'; // eslint-disable-line no-unused-vars
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';

interface IAddHelpMessageFormProps {
  formRef: any;
  handleAdd: (doc) => any;
}

const AddHelpMessageForm = (props: IAddHelpMessageFormProps) => (
  <Segment padded={true}>
    <Header dividing={true}>Add Help Message</Header>
    <AutoForm schema={HelpMessages.getDefineSchema()} onSubmit={props.handleAdd} ref={props.formRef} showInlineError={true}>
      <Form.Group widths="equal">
        <TextField name="routeName"/>
        <TextField name="title"/>
      </Form.Group>
      <LongTextField name="text"/>
      <BoolField name="retired"/>
      <SubmitField className="basic green" value="Add"/>
    </AutoForm>
  </Segment>
);

export default AddHelpMessageForm;
