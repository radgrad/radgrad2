import React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import BaseCollection from '../../../../../api/base/BaseCollection';
import { OpportunityTypes } from '../../../../../api/opportunity/OpportunityTypeCollection';

interface IUpdateOpportunityTypeFormProps {
  collection: BaseCollection;
  id: string;
  formRef: React.RefObject<unknown>;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateOpportunityTypeForm: React.FC<IUpdateOpportunityTypeFormProps> = ({ collection, id, formRef, handleUpdate, handleCancel, itemTitleString }) => {
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
        schema={new SimpleSchema2Bridge(OpportunityTypes.getUpdateSchema())}
        onSubmit={handleUpdate}
        ref={formRef}
        showInlineError
        model={model}
      >
        <TextField name="name" />
        <LongTextField name="description" />
        <BoolField name="retired" />
        <SubmitField inputRef={undefined} value="Update" disabled={false} className="" />
        <Button onClick={handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateOpportunityTypeForm;
