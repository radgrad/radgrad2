import React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { AutoForm, AutoFields, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import BaseCollection from '../../../../api/base/BaseCollection';

interface AdminDataModelUpdateFormProps {
  collection: BaseCollection;
  id: string;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const AdminDataModelUpdateForm: React.FC<AdminDataModelUpdateFormProps> = ({
  collection,
  id,
  handleCancel,
  handleUpdate,
  itemTitleString,
}) => {
  const model = id ? collection.findDoc(id) : undefined;
  return (
    <Segment padded>
      <Header dividing>
                Update
        {collection.getType()}:{itemTitleString(model)}
      </Header>
      <AutoForm schema={new SimpleSchema2Bridge(collection.getUpdateSchema())} model={model}
        onSubmit={handleUpdate}>
        <AutoFields autoField={undefined} element={undefined} fields={undefined} omitFields={undefined}/>
        <p/>
        <SubmitField className="mini basic green" inputRef={undefined} disabled={false} value="Update"/>
        <Button onClick={handleCancel} basic color="green" size="mini">Cancel</Button>
        <ErrorsField/>
      </AutoForm>
    </Segment>
  );
};

export default AdminDataModelUpdateForm;
