import React, { useState } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Markdown from 'react-markdown';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, LongTextField, SelectField, SubmitField } from 'uniforms-semantic';
import Swal from 'sweetalert2';
import { Interest } from '../../../../typings/radgrad';
import { Interests } from '../../../../api/interest/InterestCollection';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';


export interface Task6EditSegmentProps {
  interests: Interest[]
}
const Task6EditComponent: React.FC<Task6EditSegmentProps> = ({ interests }) => {
  const interestNames = interests.map((interest) => interest.name);

  const handleSubmit = (doc) => {
    const collectionName = Interests.getCollectionName();
    const updateData = doc;
    updateData.id = doc._id;
    updateData.interests = doc.interests.map((name) => Interests.findDoc(name)._id);

    updateMethod.callPromise({ collectionName, updateData })
      .then((result) => Swal.fire({
        title: 'Interest Updated',
        icon: 'success',
        text: 'Successfully updated interest.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        timer: 1500,
      }))
      .catch((error) => Swal.fire({
        title: 'Update Failed',
        text: error.message,
        icon: 'error',
        // timer: 1500,
      }));
  };

  const updateSchema = new SimpleSchema({
    interest: {
      type: String,
      allowedValues: interestNames,
    },
    description: {
      type: String,
      optional: false,
    },
  });

  const formSchema = new SimpleSchema2Bridge(updateSchema);

  return (
      <AutoForm schema = {formSchema} onSubmit = {handleSubmit} showInlineError>
          <LongTextField name="description"/>
          <SubmitField className="mini basic green" value="Submit Description"/>
      </AutoForm>
  );
};
export default withTracker(() => {
  const interests = Interests.findNonRetired();
  return {
    interests,
  };
})(Task6EditComponent);
