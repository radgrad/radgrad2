import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, BoolField, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import { Interests } from '../../../../../api/interest/InterestCollection';
import { CareerGoal, CareerGoalUpdate, Interest } from '../../../../../typings/radgrad';
import MultiSelectField from '../../../form-fields/MultiSelectField';

interface EditCareerGoalButtonProps {
  careerGoal: CareerGoal;
  interests: Interest[];
}

const EditCareerGoalButton: React.FC<EditCareerGoalButtonProps> = ({ careerGoal, interests }) => {
  const [open, setOpen] = useState(false);
  const interestNames = interests.map((interest) => interest.name);

  const model: CareerGoalUpdate = careerGoal;
  model.interests = careerGoal.interestIDs.map((id) => Interests.findDoc(id).name);

  const handleSubmit = (doc) => {
    console.log('handleSubmit', doc);
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
          <TextField name="name" />
          <LongTextField name="description" />
          <MultiSelectField name="interests" />
          <BoolField name="retired" />
          <p />
          <ErrorsField />
          <SubmitField />
          <Button color='red' onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </AutoForm>
      </Modal.Content>
    </Modal>
  );
};

export default EditCareerGoalButton;
