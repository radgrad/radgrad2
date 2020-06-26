import React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import BaseCollection from '../../../api/base/BaseCollection';
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
    <Segment padded>
      <Header dividing>
        Update
        {props.collection.getType()}
        :
        {props.itemTitleString(model)}
      </Header>
      <AutoForm
        schema={new SimpleSchema2Bridge(InterestTypes.getUpdateSchema())}
        onSubmit={props.handleUpdate}
        ref={props.formRef}
        showInlineError
        model={model}
      >
        <TextField name="name" />
        <LongTextField name="description" />
        <BoolField name="retired" />
        <SubmitField inputRef={undefined} value="Update" disabled={false} className="" />
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateInterestTypeForm;
