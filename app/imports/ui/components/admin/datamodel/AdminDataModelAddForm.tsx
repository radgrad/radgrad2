import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { AutoForm } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import BaseCollection from '../../../../api/base/BaseCollection';

interface AdminDataModelAddFormProps {
  collection: BaseCollection;
  formRef: React.RefObject<unknown>;
  handleAdd: (doc) => any;
}

const AdminDataModelAddForm: React.FC<AdminDataModelAddFormProps> = ({ collection, formRef, handleAdd }) => (
  <Segment padded>
    <Header dividing>
      Add
      {collection.getType()}
    </Header>
    <AutoForm
      ref={formRef}
      onSubmit={handleAdd}
      schema={new SimpleSchema2Bridge(collection.getDefineSchema())}
    />
  </Segment>
);

export default AdminDataModelAddForm;
