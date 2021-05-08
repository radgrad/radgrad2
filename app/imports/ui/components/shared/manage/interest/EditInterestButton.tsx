import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import {
  AutoForm,
  BoolField,
  ErrorsField,
  LongTextField,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import _ from 'lodash';
import { updateMethod } from '../../../../../api/base/BaseCollection.methods';
import { Interests } from '../../../../../api/interest/InterestCollection';
import { InterestTypes } from '../../../../../api/interest/InterestTypeCollection';
import { Interest, InterestType, InterestUpdate } from '../../../../../typings/radgrad';

interface EditInterestButtonProps {
  interest: Interest;
  interestTypes: InterestType[];
}

const EditInterestButton: React.FC<EditInterestButtonProps> = ({ interest, interestTypes }) => {
  const [open, setOpen] = useState(false);

  const model: InterestUpdate = interest;
  model.interestType = InterestTypes.findDoc(interest.interestTypeID).name;

  const interestTypeNames = interestTypes.map((type) => type.name);
  const schema = new SimpleSchema({
    name: { type: String, optional: true },
    interestType: {
      type: String,
      allowedValues: interestTypeNames,
      optional: true,
    },
    description: { type: String, optional: true },
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);

  const handleSubmit = (doc) => {
    // console.log('handleSubmit', doc);
    const collectionName = Interests.getCollectionName();
    const updateData: InterestUpdate = {};
    updateData.id = doc._id;
    if (doc.name) {
      updateData.name = doc.name;
    }
    if (doc.description) {
      updateData.description = doc.description;
    }
    if (doc.interestType) {
      updateData.interestType = InterestTypes.findDoc(doc.interestType)._id;
    }
    if (_.isBoolean(doc.retired)) {
      updateData.retired = doc.retired;
    }
    // console.log(collectionName, updateData);
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

  return (
    <Modal key={`${interest._id}-modal`}
           onClose={() => setOpen(false)}
           onOpen={() => setOpen(true)}
           open={open}
           trigger={<Button basic color='green' key={`${interest._id}-edit-button`}>EDIT</Button>}>
      <Modal.Header>{`Edit ${interest.name}`}</Modal.Header>
      <Modal.Content>
        <AutoForm model={model} schema={formSchema} showInlineError onSubmit={(doc) => {
          handleSubmit(doc);
          setOpen(false);
        }}>
          <Form.Group widths="equal">
            <TextField name="name" />
            <SelectField name="interestType" />
          </Form.Group>
          <LongTextField name="description" />
          <BoolField name="retired" />
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

export default EditInterestButton;