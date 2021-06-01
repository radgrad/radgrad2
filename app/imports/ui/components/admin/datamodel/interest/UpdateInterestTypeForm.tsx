import React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, BoolField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import BaseCollection from '../../../../../api/base/BaseCollection';
import { InterestTypes } from '../../../../../api/interest/InterestTypeCollection';

interface UpdateInterestTypeFormProps {
  collection: BaseCollection;
  id: string;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateInterestTypeForm: React.FC<UpdateInterestTypeFormProps> = ({
  collection,
  id,
  handleUpdate,
  handleCancel,
  itemTitleString,
}) => {
  const model = collection.findDoc(id);
  return (
    <Segment padded>
      <Header dividing>
                Update
        {collection.getType()}:{itemTitleString(model)}
      </Header>
      <AutoForm schema={new SimpleSchema2Bridge(InterestTypes.getUpdateSchema())} onSubmit={handleUpdate}
        showInlineError model={model}>
        <TextField name="name"/>
        <LongTextField name="description"/>
        <BoolField name="retired"/>
        <SubmitField inputRef={undefined} value="Update" disabled={false} className="mini basic green"/>
        <Button onClick={handleCancel} basic color="green" size="mini">Cancel</Button>
        <ErrorsField/>
      </AutoForm>
    </Segment>
  );
};

export default UpdateInterestTypeForm;
