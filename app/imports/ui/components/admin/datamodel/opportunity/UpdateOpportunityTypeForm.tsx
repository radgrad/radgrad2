import React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, BoolField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import BaseCollection from '../../../../../api/base/BaseCollection';
import { OpportunityTypes } from '../../../../../api/opportunity/OpportunityTypeCollection';

interface UpdateOpportunityTypeFormProps {
  collection: BaseCollection;
  id: string;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateOpportunityTypeForm: React.FC<UpdateOpportunityTypeFormProps> = ({
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
      <AutoForm schema={new SimpleSchema2Bridge(OpportunityTypes.getUpdateSchema())} onSubmit={handleUpdate}
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

export default UpdateOpportunityTypeForm;
