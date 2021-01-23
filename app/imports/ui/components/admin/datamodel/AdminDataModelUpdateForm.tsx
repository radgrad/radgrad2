import React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { AutoForm, AutoFields, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import BaseCollection from '../../../../api/base/BaseCollection';

interface AdminDataModelUpdateFormProps {
  collection: BaseCollection;
  id: string;
  formRef: React.RefObject<unknown>;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const AdminDataModelUpdateForm: React.FC<AdminDataModelUpdateFormProps> = ({ collection, id, formRef, handleCancel, handleUpdate, itemTitleString }) => {
  const model = id ? collection.findDoc(id) : undefined;
  return (
    <Segment padded>
      <Header dividing>
        Update
        {collection.getType()}:{itemTitleString(model)}
      </Header>
      <AutoForm ref={formRef} schema={new SimpleSchema2Bridge(collection.getUpdateSchema())} model={model} onSubmit={handleUpdate}>
        <AutoFields autoField={undefined} element={undefined} fields={undefined} omitFields={undefined} />
        <p />
        <SubmitField className="" inputRef={undefined} disabled={false} value={undefined} />
        <Button onClick={handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default AdminDataModelUpdateForm;
