import React from 'react';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, SubmitField, LongTextField } from 'uniforms-semantic';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { Interests } from '../../../../api/interest/InterestCollection';
import { InterestUpdate } from '../../../../typings/radgrad';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';

interface EditInterestButtonProps {
  interestName: string;
  interestDesc: string;
}

const Task6EditDescription: React.FC<EditInterestButtonProps> = ({ interestName, interestDesc }) => {
  const schema = new SimpleSchema({
    description: { type: String, defaultValue: interestDesc },
  });

  const formSchema = new SimpleSchema2Bridge(schema);

  const Submit = (data) => {
    const { description } = data;
    const collectionName = Interests.getCollectionName();
    const updateData: InterestUpdate = {};
    const doc = _.map(Interests.find({ name: interestName }).fetch())[0];
    updateData.id = doc._id;
    updateData.name = doc.name;
    updateData.interestType = doc.interestTypeID;
    updateData.retired = doc.retired;
    updateData.description = description;

    updateMethod.callPromise({ collectionName, updateData })
      .then((result) => Swal.fire({
        title: 'Description Updated',
        icon: 'success',
        text: 'Successfully updated interest.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        timer: 1500,
      }))
      .catch((error) => Swal.fire({
        title: 'Description Failed',
        text: error.message,
        icon: 'error',
      // timer: 1500,
      }));

  };

  return (
  <div>
    <AutoForm schema={formSchema} onSubmit={data => Submit(data)}>
      <LongTextField name="description" required/>
      <SubmitField className="mini basic green" value='Update Description'/>
    </AutoForm>
  </div>
  );
};

export default Task6EditDescription;
