import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { AutoFields, AutoForm, ErrorsField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import BaseCollection from '../../../../api/base/BaseCollection';
import { defineMethod } from '../../../../api/base/BaseCollection.methods';
import { defineCallback } from './utilities/add-form';

interface AdminDataModelAddFormProps {
  collection: BaseCollection;
}

const AdminDataModelAddForm: React.FC<AdminDataModelAddFormProps> = ({ collection }) => {

  let formRef;
  const handleAdd = (doc) => {
    // console.log('handleAdd(%o)', doc, formRef);
    const collectionName = collection.getCollectionName();
    const definitionData = doc; // We can do this since we don't change any of the fields in doc.
    defineMethod.callPromise({ collectionName, definitionData });
    defineCallback(formRef);
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
        <AutoFields autoField={undefined} element={undefined} fields={undefined} omitFields={undefined}/>
        <p/>
        <SubmitField className="mini basic green" inputRef={undefined} disabled={false} value="Add"/>
        <ErrorsField/>
      </AutoForm>
    </Segment>
  );
};

export default AdminDataModelAddForm;
