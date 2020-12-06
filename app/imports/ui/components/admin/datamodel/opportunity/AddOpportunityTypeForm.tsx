import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { OpportunityTypes } from '../../../../../api/opportunity/OpportunityTypeCollection';

interface IAddOpportunityTypeFormProps {
  formRef: any;
  handleAdd: (doc) => any;
}

const AddOpportunityTypeForm: React.FC<IAddOpportunityTypeFormProps> = ({ formRef, handleAdd }) => (
  <Segment padded>
    <Header dividing>Add Interest Type</Header>
    <AutoForm schema={new SimpleSchema2Bridge(OpportunityTypes.getDefineSchema())} onSubmit={handleAdd} ref={formRef} showInlineError>
      <Form.Group widths="equal">
        <TextField name="slug" />
        <TextField name="name" />
      </Form.Group>
      <LongTextField name="description" />
      <BoolField name="retired" />
      <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined} />
    </AutoForm>
  </Segment>
);

export default AddOpportunityTypeForm;
