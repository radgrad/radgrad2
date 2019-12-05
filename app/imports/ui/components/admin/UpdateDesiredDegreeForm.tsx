import * as React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
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
    <Segment padded={true}>
      <Header dividing={true}>Update {props.collection.getType()}: {props.itemTitleString(model)}</Header>
      <AutoForm
        ref={props.formRef}
        schema={props.collection.getUpdateSchema()}
        model={model}
        onSubmit={props.handleUpdate}>
        <Form.Group widths="equal">
          <TextField name="name"/>
          <TextField name="shortName"/>
        </Form.Group>
        <LongTextField name="description"/>
        <BoolField name="retired"/>
        <p/>
        <SubmitField inputRef={undefined} value={'Update'} disabled={false} className={''}/>
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateDesiredDegreeForm;
