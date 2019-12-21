import * as React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';

interface IAddInterestTypeFormProps {
  formRef: any;
  handleAdd: (doc) => any;
}

const AddInterestTypeForm = (props: IAddInterestTypeFormProps) => (
  <Segment padded>
    <Header dividing>Add Interest Type</Header>
    <AutoForm schema={InterestTypes.getDefineSchema()} onSubmit={props.handleAdd} ref={props.formRef} showInlineError>
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
