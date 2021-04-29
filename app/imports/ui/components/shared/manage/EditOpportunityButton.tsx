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
  terms,
  interests,
  sponsors,
}) => {
  const [open, setOpen] = useState(false);
  const [pictureURL, setPictureURL] = useState(opportunity.picture);

  // Get the names for the AutoForm
  const termNames = terms.map((term) => AcademicTerms.toString(term._id));
  // TODO Can we change the sponsor?
  const sponsorNames = sponsors.map((sponsor) => Users.getFullName(sponsor.userID));
  const interestNames = interests.map((interest) => interest.name);
  const typeNames = OpportunityTypes.findNonRetired().map((type) => type.name);

  const model: OpportunityUpdate = {};
  // Create the model so that it can be used in the AutoForm
  model.name = opportunity.name;
  model.description = opportunity.description;
  model.opportunityType = OpportunityTypes.findDoc(opportunity.opportunityTypeID).name;
  model.sponsor = Users.getFullName(opportunity.sponsorID);
  model.academicTerms = opportunity.termIDs.map((id) => AcademicTerms.toString(id));
  model.interests = opportunity.interestIDs.map((id) => Interests.findDoc(id).name);
  model.timestamp = opportunity.timestamp;
  model.eventDate = opportunity.eventDate;
  model.ice = opportunity.ice;
  model.picture = opportunity.picture;
  model.retired = opportunity.retired;
  const updateOpportunitySchema = new SimpleSchema({
    name: { type: String, optional: true },
    description: { type: String, optional: true },
    opportunityType: { type: String, optional: true, allowedValues: typeNames },
    sponsor: { type: String, optional: true, allowedValues: sponsorNames },
    academicTerms: { type: Array, optional: true },
    'academicTerms.$': { type: String, allowedValues: termNames },
    interests: { type: Array, optional: true },
    'interests.$': { type: String, allowedValues: interestNames },
    timestamp: { type: Date, optional: true },
    eventDate: { type: Date, optional: true },
    ice: { type: iceSchema, optional: true },
    picture: { type: String, optional: true },
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(updateOpportunitySchema);

  // Technical Debt: We should consolidate this functionality. It is used in several different places.
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

  const handleSubmit = (modelDoc) => {
    console.log('handleSubmit', modelDoc);
    const collectionName = Opportunities.getCollectionName();
    const updateData: OpportunityUpdate = {};
    updateData.id = modelDoc._id;
    updateData.name = modelDoc.name;
    updateData.description = modelDoc.description;
    updateData.opportunityType = OpportunityTypes.findDoc(modelDoc.opportunityType)._id;
    updateData.sponsor = Users.getUsernameFromFullName(modelDoc.sponsor);
    updateData.academicTerms = modelDoc.academicTerms.map((toString) => AcademicTerms.getAcademicTermFromToString(toString));
    updateData.interests = modelDoc.interests.map((name) => {
      const doc = Interests.findDoc(name);
      return Interests.findSlugByID(doc._id);
    });
    updateData.timestamp = modelDoc.timestamp;
    updateData.eventDate = modelDoc.eventDate;
    updateData.ice = modelDoc.ice;
    updateData.picture = modelDoc.picture;
    updateData.retired = modelDoc.retired;
    console.log(collectionName, updateData);
    updateMethod.call({ collectionName, updateData }, ((error, result) => {
      if (error) {
        Swal.fire({
          title: 'Failed to update Opportunity',
          icon: 'error',
          text: error.statusText,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          title: 'Updated Opportunity',
          icon: 'success',
          text: result,
          timer: 1500,
        });
      }
      setOpen(false);
    }));
  };
  // console.log(model);
  return (
    <Modal key={`${opportunity._id}-modal`}
           onClose={() => setOpen(false)}
           onOpen={() => setOpen(true)}
           open={open}
           trigger={<Button basic color='green' key={`${opportunity._id}-edit-button`}>EDIT</Button>}
    >
      <Modal.Header>{`Edit ${opportunity.name}`}</Modal.Header>
      <Modal.Content>
        <AutoForm model={model} schema={formSchema} onSubmit={(doc) => {
          console.log('onSubmit', doc);
          handleSubmit(doc);
        }}>
          <Form.Group widths="equal">
            <TextField name="name" />
          </Form.Group>
          <Form.Group widths="equal">
            <SelectField name="opportunityType" />
            <SelectField name="sponsor" />
          </Form.Group>
          <LongTextField name="description" />
          <Form.Group widths="equal">
            <MultiSelectField name="academicTerms" />
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
