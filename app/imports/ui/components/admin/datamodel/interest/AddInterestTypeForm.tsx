import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { InterestTypes } from '../../../../../api/interest/InterestTypeCollection';

interface AddInterestTypeFormProps {
  formRef: React.RefObject<unknown>;
  handleAdd: (doc) => any;
}

const AddInterestTypeForm: React.FC<AddInterestTypeFormProps> = ({ formRef, handleAdd }) => (
  <Segment padded>
    <Header dividing>Add Interest Type</Header>
    <AutoForm schema={new SimpleSchema2Bridge(InterestTypes.getDefineSchema())} onSubmit={handleAdd} ref={formRef} showInlineError>
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

export default AddInterestTypeForm;