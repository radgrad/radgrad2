import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

interface IAddDesiredDegreeFormProps {
  formRef: any;
  handleAdd: (doc) => any;
}

const AddDesiredDegreeForm = (props: IAddDesiredDegreeFormProps) => (
  <Segment padded>
    <Header dividing>Add Desired Degree</Header>
    <AutoForm
      schema={new SimpleSchema2Bridge(DesiredDegrees.getDefineSchema())}
      onSubmit={props.handleAdd}
      ref={props.formRef}
      showInlineError
    >
      <Form.Group widths="equal">
        <TextField name="slug" placeholder="bs_science" />
        <TextField name="name" placeholder="B.S. in Science" />
        <TextField name="shortName" placeholder="B.S. S" />
      </Form.Group>
      <LongTextField name="description" />
      <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined} />
    </AutoForm>
  </Segment>
);

export default AddDesiredDegreeForm;
