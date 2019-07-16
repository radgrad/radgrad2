import * as React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'; // eslint-disable-line no-unused-vars
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';

interface IUpdateInterestTypeFormProps {
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateInterestTypeForm = (props: IUpdateInterestTypeFormProps) => {
  const model = props.collection.findDoc(props.id);
  return (
    <Segment padded={true}>
      <Header dividing={true}>Update {props.collection.getType()}: {props.itemTitleString(model)}</Header>
      <AutoForm schema={InterestTypes.getUpdateSchema()} onSubmit={props.handleUpdate} ref={props.formRef}
                showInlineError={true} model={model}>
        <TextField name="name"/>
        <LongTextField name="description"/>
        <BoolField name="retired"/>
        <SubmitField/>
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateInterestTypeForm;
