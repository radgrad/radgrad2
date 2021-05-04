import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  BoolField, DateField,
  ErrorsField,
  LongTextField,
  NumField,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';
import { iceSchema } from '../../../../api/ice/IceProcessor';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { OpportunityTypes } from '../../../../api/opportunity/OpportunityTypeCollection';
import { Users } from '../../../../api/user/UserCollection';
import { OpportunityUpdate } from '../../../../typings/radgrad';
import MultiSelectField from '../../form-fields/MultiSelectField';
import { openCloudinaryWidget } from '../OpenCloudinaryWidget';
import { ManageOpportunityProps } from './ManageOpportunityProps';

const EditOpportunityButton: React.FC<ManageOpportunityProps> = ({
  opportunity,
  opportunityTypes,
  interests,
  terms,
  sponsors,
}) => {
  const [open, setOpen] = useState(false);
  const [pictureURL, setPictureURL] = useState(opportunity.picture);
  // console.log(opportunityTypes, interests, terms, sponsors);

  const interestNames = interests.map((interest) => interest.name);
  const termNames = terms.map((term) => AcademicTerms.toString(term._id));
  const sponsorNames = sponsors.map((profile) => Users.getFullName(profile.userID));
  const opportunityTypeNames = OpportunityTypes.findNonRetired().map((type) => type.name);

  const model: OpportunityUpdate = opportunity;
  // convert ids to names
  model.interests = opportunity.interestIDs.map((id) => Interests.findDoc(id).name);
  model.academicTerms = opportunity.termIDs.map((id) => AcademicTerms.toString(id));
  model.academicTerms = model.academicTerms.filter((term) => termNames.includes(term));
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
    updateData.academicTerms = doc.academicTerms.map((name) => AcademicTerms.getAcademicTermFromToString(name)._id);
    // console.log(collectionName, updateData);
    updateMethod.callPromise({ collectionName, updateData })
      .then((result) => Swal.fire({
        title: 'Opportunity Updated',
        icon: 'success',
        text: 'Successfully updated opportunity.',
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

  const handleUpload = async (e): Promise<void> => {
    e.preventDefault();
    try {
      const cloudinaryResult = await openCloudinaryWidget();
      if (cloudinaryResult.event === 'success') {
        setPictureURL(cloudinaryResult.info.secure_url);
      }
    } catch (error) {
      Swal.fire({
        title: 'Failed to Upload Photo',
        icon: 'error',
        text: error.statusText,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    }
  };
  const handlePictureUrlChange = (value) => {
    setPictureURL(value);
  };

  const updateSchema = new SimpleSchema({
    description: { type: String, optional: true },
    picture: {
      type: String,
      label: (
        <React.Fragment>
          Picture (
          <button type="button" onClick={handleUpload}>
            Upload
          </button>
          )
        </React.Fragment>
      ),
      optional: true,
    },
    sponsor: { type: String, allowedValues: sponsorNames, optional: true },
    interests: { type: Array, optional: true },
    'interests.$': {
      type: String,
      allowedValues: interestNames,
    },
    opportunityType: { type: String, allowedValues: opportunityTypeNames, optional: true },
    academicTerms: { type: Array, optional: true },
    'academicTerms.$': {
      type: String,
      allowedValues: termNames,
    },
    name: { type: String, optional: true },
    eventDate: { type: Date, optional: true },
    eventDate1: { type: Date, optional: true },
    eventDateLabel1: { type: String, optional: true },
    eventDate2: { type: Date, optional: true },
    eventDateLabel2: { type: String, optional: true },
    eventDate3: { type: Date, optional: true },
    eventDateLabel3: { type: String, optional: true },
    eventDate4: { type: Date, optional: true },
    eventDateLabel4: { type: String, optional: true },
    ice: { type: iceSchema, optional: true },
    retired: { type: Boolean, optional: true },
  });
  const updateFormSchema = new SimpleSchema2Bridge(updateSchema);

  return (
    <Modal key={`${opportunity._id}-modal`}
           onClose={() => setOpen(false)}
           onOpen={() => setOpen(true)}
           open={open}
           trigger={<Button basic color='green' key={`${opportunity._id}-edit-button`}>EDIT</Button>}>
      <Modal.Header>{`Edit ${opportunity.name}`}</Modal.Header>
      <Modal.Content>
        <AutoForm model={model} schema={updateFormSchema} showInlineError onSubmit={(doc) => {
          handleSubmit(doc);
          setOpen(false);
        }}>
          <TextField name="name" />
          <MultiSelectField name="academicTerms" />
          <Form.Group widths="equal">
            <SelectField name="opportunityType" />
            <SelectField name="sponsor" />
          </Form.Group>
          <LongTextField name="description" />
          <Form.Group widths="equal">
            <TextField name="picture" value={pictureURL} onChange={handlePictureUrlChange} />
            <MultiSelectField name="interests" />
          </Form.Group>
          <DateField name="eventDate" />
          <Form.Group widths="equal">
            <DateField name="eventDate1" />
            <TextField name="eventDateLabel1" />
          </Form.Group>
          <Form.Group widths="equal">
            <DateField name="eventDate2" />
            <TextField name="eventDateLabel2" />
          </Form.Group>
          <Form.Group widths="equal">
            <DateField name="eventDate3" />
            <TextField name="eventDateLabel3" />
          </Form.Group>
          <Form.Group widths="equal">
            <DateField name="eventDate4" />
            <TextField name="eventDateLabel4" />
          </Form.Group>
          <Form.Group widths="equal">
            <NumField name="ice.i" />
            <NumField name="ice.c" />
            <NumField name="ice.e" />
          </Form.Group>
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

export default EditOpportunityButton;
