import React from 'react';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoForm, LongTextField, SubmitField } from 'uniforms-semantic';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';
import { Interest } from '../../../../typings/radgrad';
import { Interests } from '../../../../api/interest/InterestCollection';
import RadGradAlert from '../../../utilities/RadGradAlert';

interface EditDescriptionProps {
  interests: Interest;
}

const Task6EditDescription: React.FC<EditDescriptionProps> = ({ interests }) => {
  const handleSubmit = (doc) => {
    const collectionName = Interests.getCollectionName();
    const updateData = doc;
    updateData.id = interests._id;
    updateMethod.callPromise({ collectionName, updateData })
      .then(() => RadGradAlert.success('Description Updated'))
      .catch((error) => RadGradAlert.failure('Update Failed', error.message));
  };

  const descriptionSchema = new SimpleSchema({
    description: {
      type: String,
    },
  });
  const formSchema = new SimpleSchema2Bridge(descriptionSchema);

  return (
    <AutoForm schema={formSchema} onSubmit={handleSubmit} showInlineError>
      <LongTextField name='description' showInlineError/>
      <SubmitField className='mini basic green' value='Update Description'/>
    </AutoForm>
  );
};

export default Task6EditDescription;