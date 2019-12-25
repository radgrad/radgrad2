import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, SubmitField } from 'uniforms-semantic';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

interface IAddDesiredDegreeFormProps {
  formRef: any;
  handleAdd: (doc) => any;
}

const AddDesiredDegreeForm = (props: IAddDesiredDegreeFormProps) => (
  <Segment padded={true}>
    <Header dividing={true}>Add Desired Degree</Header>
    <AutoForm schema={DesiredDegrees.getDefineSchema()} onSubmit={props.handleAdd} ref={props.formRef}
              showInlineError={true}>
      <Form.Group widths="equal">
        <TextField name="slug" placeholder="bs_science"/>
        <TextField name="name" placeholder="B.S. in Science"/>
        <TextField name="shortName" placeholder="B.S. S"/>
      </Form.Group>
      <LongTextField name="description"/>
      <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined}/>
    </AutoForm>
  </Segment>
);

export default AddDesiredDegreeForm;
