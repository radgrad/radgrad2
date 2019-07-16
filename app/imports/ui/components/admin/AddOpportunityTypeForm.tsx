import * as React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'; // eslint-disable-line no-unused-vars
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';

interface IAddOpportunityTypeFormProps {
  formRef: any;
  handleAdd: (doc) => any;
}

const AddOpportunityTypeForm = (props: IAddOpportunityTypeFormProps) => (
  <Segment padded={true}>
    <Header dividing={true}>Add Interest Type</Header>
    <AutoForm schema={OpportunityTypes.getDefineSchema()} onSubmit={props.handleAdd} ref={props.formRef} showInlineError={true}>
      <Form.Group widths="equal">
        <TextField name="slug"/>
        <TextField name="name"/>
      </Form.Group>
      <LongTextField name="description"/>
      <BoolField name="retired"/>
      <SubmitField className="basic green" value="Add"/>
    </AutoForm>
  </Segment>
);

export default AddOpportunityTypeForm;
