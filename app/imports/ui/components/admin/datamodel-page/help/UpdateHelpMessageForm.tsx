import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { HelpMessages } from '../../../../../api/help/HelpMessageCollection';
import BaseCollection from '../../../../../api/base/BaseCollection';

interface IUpdateHelpMessageFormProps {
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateHelpMessageForm = (props: IUpdateHelpMessageFormProps) => {
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
        schema={new SimpleSchema2Bridge(HelpMessages.getUpdateSchema())}
        onSubmit={props.handleUpdate}
        ref={props.formRef}
        showInlineError
        model={model}
      >
        <Form.Group widths="equal">
          <TextField name="routeName" />
          <TextField name="title" />
        </Form.Group>
        <LongTextField name="text" />
        <BoolField name="retired" />
        <SubmitField inputRef={undefined} value="Update" disabled={false} className="" />
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateHelpMessageForm;
