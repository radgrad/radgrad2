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

const UpdateHelpMessageForm: React.FC<IUpdateHelpMessageFormProps> = ({ collection, id, formRef, handleUpdate, handleCancel, itemTitleString }) => {
  const model = collection.findDoc(id);
  return (
    <Segment padded>
      <Header dividing>
        Update
        {collection.getType()}
        :
        {itemTitleString(model)}
      </Header>
      <AutoForm
        schema={new SimpleSchema2Bridge(HelpMessages.getUpdateSchema())}
        onSubmit={handleUpdate}
        ref={formRef}
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
        <Button onClick={handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateHelpMessageForm;
