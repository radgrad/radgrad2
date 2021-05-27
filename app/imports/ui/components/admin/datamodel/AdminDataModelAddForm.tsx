import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { AutoFields, AutoForm, ErrorsField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import Swal from 'sweetalert2';
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
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => {
        Swal.fire({
          title: 'Add failed',
          text: error.message,
          icon: 'error',
        });
      })
      .then(() => {
        Swal.fire({
          title: 'Add succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        formRef.reset();
      });
  };

  return (
    <Segment padded>
      <Header dividing>
        Add
        {collection.getType()}
      </Header>
      {/* eslint-disable-next-line no-param-reassign,no-return-assign */}
      <AutoForm ref={(ref) => formRef = ref} onSubmit={handleAdd}
                schema={new SimpleSchema2Bridge(collection.getDefineSchema())}>
        <AutoFields autoField={undefined} element={undefined} fields={undefined} omitFields={undefined} />
        <p />
        <SubmitField className="mini basic green" inputRef={undefined} disabled={false} value="Add" />
        <ErrorsField />
      </AutoForm>
    </Segment>
  );
};

export default AdminDataModelAddForm;
