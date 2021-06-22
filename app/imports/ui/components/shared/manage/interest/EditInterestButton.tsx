import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
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
import RadGradAlert from '../../../../utilities/RadGradAlert';
import { updateMethod } from '../../../../../api/base/BaseCollection.methods';
import { Interests } from '../../../../../api/interest/InterestCollection';
import { InterestTypes } from '../../../../../api/interest/InterestTypeCollection';
import { Interest, InterestType, InterestUpdate } from '../../../../../typings/radgrad';
import PictureField from '../../../form-fields/PictureField';

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
    picture: { type: String, optional: true },
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
      .then((result) => { RadGradAlert.success('Interest Updated', result);})
      .catch((error) => { RadGradAlert.failure('Update Failed', error.message, error);});
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
            <TextField name="name"/>
            <SelectField name="interestType"/>
          </Form.Group>
          <PictureField name="picture" placeholder='https://mywebsite.com/picture.png' />
          <LongTextField name="description"/>
          <BoolField name="retired"/>
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

export default EditInterestButton;
