import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  BoolField,
  ErrorsField,
  LongTextField,
  NumField,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import RadGradAlert from '../../../../utilities/RadGradAlert';
import { updateMethod } from '../../../../../api/base/BaseCollection.methods';
import { iceSchema } from '../../../../../api/ice/IceProcessor';
import { Interests } from '../../../../../api/interest/InterestCollection';
import { Opportunities } from '../../../../../api/opportunity/OpportunityCollection';
import { OpportunityTypes } from '../../../../../api/opportunity/OpportunityTypeCollection';
import { Users } from '../../../../../api/user/UserCollection';
import { OpportunityUpdate } from '../../../../../typings/radgrad';
import DayField from '../../../form-fields/DayField';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import PictureField from '../../../form-fields/PictureField';
import { ManageOpportunityProps } from './ManageOpportunityProps';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';

SimpleSchema.extendOptions(['autoform']);

const EditOpportunityButton: React.FC<ManageOpportunityProps> = ({
  opportunity,
  opportunityTypes,
  interests,
  sponsors,
}) => {
  const [open, setOpen] = useState(false);
  // console.log(opportunityTypes, interests, sponsors);

  const interestNames = interests.map((interest) => interest.name);
  const sponsorNames = sponsors.map((profile) => Users.getFullName(profile.userID));
  const opportunityTypeNames = OpportunityTypes.findNonRetired().map((type) => type.name);

  const model: OpportunityUpdate = opportunity;
  // convert ids to names
  model.interests = opportunity.interestIDs.map((id) => Interests.findDoc(id).name);
  model.sponsor = Users.getFullName(opportunity.sponsorID);
  model.opportunityType = OpportunityTypes.findDoc(opportunity.opportunityTypeID).name;

  const handleSubmit = (doc) => {
    // console.log('handleSubmit', doc);
    const collectionName = Opportunities.getCollectionName();
    const updateData: OpportunityUpdate = doc;
    updateData.id = doc._id;
    // map names to ids or slugs
    updateData.interests = doc.interests.map((name) => Interests.findDoc(name)._id);
    updateData.opportunityType = OpportunityTypes.findDoc(doc.opportunityType)._id;
    updateData.sponsor = Users.getUsernameFromFullName(doc.sponsor);
    // console.log(collectionName, updateData);
    updateMethod.callPromise({ collectionName, updateData })
      .then((result) => { RadGradAlert.success('Opportunity Updated', result);})
      .catch((error) => { RadGradAlert.failure('Update Failed', error.message, error);});
  };

  const updateSchema = new SimpleSchema({
    name: { type: String, optional: true },
    description: { type: String, optional: true },
    opportunityType: { type: String, allowedValues: opportunityTypeNames, optional: true },
    sponsor: { type: String, allowedValues: sponsorNames, optional: true },
    interests: { type: Array, optional: true },
    'interests.$': {
      type: String,
      allowedValues: interestNames,
    },
    picture: { type: String, optional: true },
    eventDate1: { type: Date, optional: true },
    eventDateLabel1: { type: String, optional: true },
    eventDate2: { type: Date, optional: true },
    eventDateLabel2: { type: String, optional: true },
    eventDate3: { type: Date, optional: true },
    eventDateLabel3: { type: String, optional: true },
    eventDate4: { type: Date, optional: true },
    eventDateLabel4: { type: String, optional: true },
    clearEventDate1: { type: Boolean, optional: true },
    clearEventDate2: { type: Boolean, optional: true },
    clearEventDate3: { type: Boolean, optional: true },
    clearEventDate4: { type: Boolean, optional: true },
    ice: { type: iceSchema, optional: true },
    retired: { type: Boolean, optional: true },
  });
  const updateFormSchema = new SimpleSchema2Bridge(updateSchema);

  return (
    <Modal key={`${opportunity._id}-modal`}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button basic color='green' id={COMPONENTIDS.EDIT_OPPORTUNITY_BUTTON} key={`${opportunity._id}-edit-button`}>EDIT</Button>}>
      <Modal.Header>{`Edit ${opportunity.name}`}</Modal.Header>
      <Modal.Content>
        <AutoForm model={model} schema={updateFormSchema} showInlineError onSubmit={(doc) => {
          handleSubmit(doc);
          setOpen(false);
        }}>
          <TextField name="name"/>
          <Form.Group widths="equal">
            <SelectField name="opportunityType"/>
            <SelectField name="sponsor"/>
          </Form.Group>
          <LongTextField name="description"/>
          <Form.Group widths="equal">
            <PictureField name="picture"/>
            <MultiSelectField name="interests"/>
          </Form.Group>
          <Form.Group widths="equal">
            <DayField name="eventDate1"/>
            <TextField name="eventDateLabel1"/>
          </Form.Group>
          <Form.Group widths="equal">
            <DayField name="eventDate2"/>
            <TextField name="eventDateLabel2"/>
          </Form.Group>
          <Form.Group widths="equal">
            <DayField name="eventDate3"/>
            <TextField name="eventDateLabel3"/>
          </Form.Group>
          <Form.Group widths="equal">
            <DayField name="eventDate4"/>
            <TextField name="eventDateLabel4"/>
          </Form.Group>
          <Form.Group widths="equal">
            <BoolField name="clearEventDate1"/>
            <BoolField name="clearEventDate2"/>
            <BoolField name="clearEventDate3"/>
            <BoolField name="clearEventDate4"/>
          </Form.Group>
          <Form.Group widths="equal">
            <NumField name="ice.i"/>
            <NumField name="ice.c"/>
            <NumField name="ice.e"/>
          </Form.Group>
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

export default EditOpportunityButton;
