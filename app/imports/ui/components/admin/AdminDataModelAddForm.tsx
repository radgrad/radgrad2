import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { AutoForm } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import BaseCollection from '../../../api/base/BaseCollection';

interface IAdminDataModelAddFormProps {
  collection: BaseCollection;
  formRef: any;
  handleAdd: (doc) => any;
}

const AdminDataModelAddForm = (props: IAdminDataModelAddFormProps) => (
  <Segment padded>
    <Header dividing>
      Add
      {props.collection.getType()}
    </Header>
    <AutoForm
      ref={props.formRef}
      onSubmit={props.handleAdd}
      schema={new SimpleSchema2Bridge(props.collection.getDefineSchema())}
    />
  </Segment>
);

export default AdminDataModelAddForm;
