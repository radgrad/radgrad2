import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line

interface IUpdateDesiredDegreeFormProps {
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateDesiredDegreeForm = (props: IUpdateDesiredDegreeFormProps) => {
  const model = props.collection.findDoc(props.id);
  return (
    <Segment padded>
      <Header dividing>
Update
        {props.collection.getType()}
:
        {props.itemTitleString(model)}
      </Header>
      <AutoForm
        ref={props.formRef}
        schema={props.collection.getUpdateSchema()}
        model={model}
        onSubmit={props.handleUpdate}
      >
        <Form.Group widths="equal">
          <TextField name="name" />
          <TextField name="shortName" />
        </Form.Group>
        <LongTextField name="description" />
        <BoolField name="retired" />
        <p />
        <SubmitField inputRef={undefined} value="Update" disabled={false} className="" />
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateDesiredDegreeForm;
