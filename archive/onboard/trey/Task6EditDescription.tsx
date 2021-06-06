import React from 'react';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoForm, LongTextField, SubmitField } from 'uniforms-semantic';
import { updateMethod } from '../../../app/imports/api/base/BaseCollection.methods';
import { Interest } from '../../../app/imports/typings/radgrad';
import { Interests } from '../../../app/imports/api/interest/InterestCollection';

interface Task6EditDescriptionProps {
  interest: Interest;
}

const Task6EditDescription: React.FC<Task6EditDescriptionProps> = ({ interest }) => {

  const handleSubmit = (doc) => {
    const collectionName = Interests.getCollectionName();
    const updateData = doc;
    updateData.id = interest._id;
    updateMethod.callPromise({ collectionName, updateData }).then(() => Swal.fire({
      title: 'Description Updated',
      icon: 'success',
    }))
      .catch((error) => Swal.fire({
        title: 'Update Failed',
        text: error.message,
        icon: 'error',
      }));
  };

  const schema = new SimpleSchema({
    description: {
      type: String,
    },
  });
  const formSchema = new SimpleSchema2Bridge(schema);

  return (
    <AutoForm schema={formSchema} onSubmit={handleSubmit} showInlineError>
      <LongTextField name="description" />
      <SubmitField className="mini basic green" value="Update Description" />
    </AutoForm>
  );
};

export default Task6EditDescription;