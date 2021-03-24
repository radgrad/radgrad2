import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { AutoForm } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import BaseCollection from '../../../../api/base/BaseCollection';
import { defineMethod } from '../../../../api/base/BaseCollection.methods';

interface AdminDataModelAddFormProps {
  collection: BaseCollection;
}

const AdminDataModelAddForm: React.FC<AdminDataModelAddFormProps> = ({ collection }) => {

  let formRef;
  const handleAdd = (doc) => {
    // console.log('handleAdd(%o)', doc, formRef);
    const collectionName = collection.getCollectionName();
    const definitionData = doc;
    const callback = (formRef2) => (error) => {
      if (error) {
        Swal.fire({
          title: 'Add failed',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Add succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        formRef2.reset();
      }
    };
    defineMethod.call({ collectionName, definitionData }, callback(formRef));
  };

  return (
    <Segment padded>
      <Header dividing>
        Add
        {collection.getType()}
      </Header>
      {/* eslint-disable-next-line no-param-reassign,no-return-assign */}
      <AutoForm ref={(ref) => formRef = ref} onSubmit={handleAdd} schema={new SimpleSchema2Bridge(collection.getDefineSchema())} />
    </Segment>
  );
};

export default AdminDataModelAddForm;
