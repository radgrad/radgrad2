import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, BoolField, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import RadGradAlert from '../../../../utilities/RadGradAlert';
import { updateMethod } from '../../../../../api/base/BaseCollection.methods';
import { CareerGoals } from '../../../../../api/career/CareerGoalCollection';
import { Interests } from '../../../../../api/interest/InterestCollection';
import { CareerGoal, CareerGoalUpdate, Interest } from '../../../../../typings/radgrad';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import PictureField from '../../../form-fields/PictureField';

interface EditCareerGoalButtonProps {
  careerGoal: CareerGoal;
  interests: Interest[];
}

const EditCareerGoalButton: React.FC<EditCareerGoalButtonProps> = ({ careerGoal, interests }) => {
  const [open, setOpen] = useState(false);
  const interestNames = interests.map((interest) => interest.name);

  const model: CareerGoalUpdate = careerGoal;
  // convert the interestIDs to names for the form.
  model.interests = careerGoal.interestIDs.map((id) => Interests.findDoc(id).name);

  const handleSubmit = (doc) => {
    // console.log('handleSubmit', doc);
    const collectionName = CareerGoals.getCollectionName();
    const updateData: CareerGoalUpdate = doc;
    updateData.id = doc._id;
    // convert the interest names to IDs for the update
    updateData.interests = doc.interests.map((name) => Interests.findDoc(name)._id);
    // console.log(collectionName, updateData);
    updateMethod.callPromise({ collectionName, updateData })
      .then((result) => { RadGradAlert.success('Career Goal Updated', result);})
      .catch((error) => { RadGradAlert.failure('Update Failed', error.message, error);});
  };

  const updateSchema = new SimpleSchema({
    name: String,
    description: String,
    interests: {
      type: Array,
    },
    'interests.$': {
      type: String,
      allowedValues: interestNames,
    },
    retired: { type: Boolean, optional: true },
    picture: { type: String, optional: true, defaultValue: 'header-career.png' },
  });
  const formSchema = new SimpleSchema2Bridge(updateSchema);

  return (
    <Modal key={`${careerGoal._id}-modal`}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button basic color='green' key={`${careerGoal._id}-edit-button`}>EDIT</Button>}>
      <Modal.Header>{`Edit ${careerGoal.name}`}</Modal.Header>
      <Modal.Content>
        <AutoForm model={model} schema={formSchema} showInlineError onSubmit={(doc) => {
          handleSubmit(doc);
          setOpen(false);
        }}>
          <TextField name="name"/>
          <LongTextField name="description"/>
          <MultiSelectField name="interests"/>
          <PictureField name="picture" placeholder='https://mywebsite.com/picture.png'/>
          <BoolField name="retired"/>
          <p/>
          <SubmitField/>
          <Button color='red' onClick={() => setOpen(false)}>
                        Cancel
          </Button>
          <ErrorsField/>
        </AutoForm>
      </Modal.Content>
    </Modal>
  );
};

export default EditCareerGoalButton;
