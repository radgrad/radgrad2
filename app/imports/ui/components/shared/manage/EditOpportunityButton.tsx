import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  BoolField,
  DateField,
  LongTextField,
  NumField,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { iceSchema } from '../../../../api/ice/IceProcessor';
import { Interests } from '../../../../api/interest/InterestCollection';
import { OpportunityTypes } from '../../../../api/opportunity/OpportunityTypeCollection';
import { Users } from '../../../../api/user/UserCollection';
import { OpportunityUpdate } from '../../../../typings/radgrad';
import MultiSelectField from '../../form-fields/MultiSelectField';
import { openCloudinaryWidget } from '../OpenCloudinaryWidget';
import { ManageOpportunityProps } from './ManageOpportunityProps';

const EditOpportunityButton: React.FC<ManageOpportunityProps> = ({
  opportunity,
  opportunityTypes,
  terms,
  interests,
  sponsors,
}) => {
  const [open, setOpen] = useState(false);
  const [pictureURL, setPictureURL] = useState(opportunity.picture);

  // Get the names for the AutoForm
  const termNames = terms.map((term) => AcademicTerms.toString(term._id));
  // Can we change the sponsor?
  const sponsorNames = sponsors.map((sponsor) => Users.getFullName(sponsor.userID));
  const interestNames = interests.map((interest) => interest.name);
  const typeNames = OpportunityTypes.findNonRetired().map((type) => type.name);

  const model: OpportunityUpdate = opportunity;
  // update the model so that it can be used in the AutoForm
  model.interests = opportunity.interestIDs.map((id) => Interests.findDoc(id).name);
  model.academicTerms = opportunity.termIDs.map((id) => AcademicTerms.toString(id));
  const updateOpportunitySchema = new SimpleSchema({
    name: { type: String, optional: true },
    description: { type: String, optional: true },
    opportunityType: { type: String, optional: true, allowedValues: typeNames },
    sponsor: { type: String, optional: true, allowedValues: sponsorNames },
    terms: { type: Array, optional: true },
    'terms.$': { type: String, allowedValues: termNames },
    interests: { type: Array, optional: true },
    'interests.$': { type: String, allowedValues: interestNames },
    timestamp: { type: Date, optional: true },
    eventDate: { type: Date, optional: true },
    ice: { type: iceSchema, optional: true },
    picture: { type: String, optional: true },
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(updateOpportunitySchema);

  const handleUploadPicture = async (e): Promise<void> => {
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

  return (
    <Modal key={`${opportunity._id}-modal`}
           onClose={() => setOpen(false)}
           onOpen={() => setOpen(true)}
           open={open}
           trigger={<Button basic color='green' key={`${opportunity._id}-edit-button`}>EDIT</Button>}
    >
      <Modal.Header>{`Edit ${opportunity.name}`}</Modal.Header>
      <Modal.Content>
        <AutoForm model={model} schema={formSchema} onSubmit={(doc) => console.log(doc)}>
          <Form.Group widths="equal">
            <TextField name="name" />
          </Form.Group>
          <Form.Group widths="equal">
            <SelectField name="opportunityType" />
            <SelectField name="sponsor" />
          </Form.Group>
          <LongTextField name="description" />
          <Form.Group widths="equal">
            <MultiSelectField name="terms" />
            <MultiSelectField name="interests" />
          </Form.Group>
          <DateField name="eventDate" />
          <Form.Group widths="equal">
            <NumField name="ice.i" />
            <NumField name="ice.c" />
            <NumField name="ice.e" />
          </Form.Group>
          <BoolField name="retired" />
          <Form.Group widths="equal">
            <Form.Input name="picture" value={pictureURL} onChange={handlePictureUrlChange} />
            <Form.Button basic color="green" onClick={handleUploadPicture}>
              Upload
            </Form.Button>
          </Form.Group>
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
