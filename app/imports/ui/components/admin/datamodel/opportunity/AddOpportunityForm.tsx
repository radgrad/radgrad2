import React, { useState } from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, LongTextField, DateField, BoolField, SubmitField, NumField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { Opportunities } from '../../../../../api/opportunity/OpportunityCollection';
import slugify from '../../../../../api/slug/SlugCollection';
import { AcademicTerm, BaseProfile, Interest, OpportunityType } from '../../../../../typings/radgrad';
import {
  academicTermNameToSlug,
  academicTermToName,
  docToName, opportunityTypeNameToSlug, profileNameToUsername,
  profileToName,
} from '../../../shared/utilities/data-model';
import { iceSchema } from '../../../../../api/ice/IceProcessor';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import { openCloudinaryWidget } from '../../../shared/OpenCloudinaryWidget';
import { interestSlugFromName } from '../../../shared/utilities/form';
import { defineCallback } from '../utilities/add-form';

interface AddOpportunityFormProps {
  sponsors: BaseProfile[];
  terms: AcademicTerm[];
  interests: Interest[];
  opportunityTypes: OpportunityType[];
}

// Technical Debt: Picture part of the form is different than the AddUserForm.

const AddOpportunityForm: React.FC<AddOpportunityFormProps> = ({ sponsors, interests, terms, opportunityTypes }) => {
  const [pictureURL, setPictureURL] = useState<string>('');
  const sponsorNames = sponsors.map(profileToName);
  const termNames = terms.map(academicTermToName);
  const opportunityTypeNames = opportunityTypes.map(docToName);
  const interestNames = interests.map(docToName);
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
  let formRef;
  const handleAdd = (doc) => {
    // console.log('Opportunities.handleAdd(%o)', doc);
    const collectionName = Opportunities.getCollectionName();
    const definitionData = doc;
    const docInterestNames = doc.interests.map(interestSlugFromName);
    const docTerms = doc.terms.map(academicTermNameToSlug);
    definitionData.interests = docInterestNames;
    definitionData.academicTerms = docTerms;
    definitionData.opportunityType = opportunityTypeNameToSlug(doc.opportunityType);
    definitionData.sponsor = profileNameToUsername(doc.sponsor);
    definitionData.slug = `${slugify(doc.name)}-opportunity`;
    console.log(definitionData);
    defineMethod.call({ collectionName, definitionData }, defineCallback(formRef));
  };

  // Hacky way of resetting pictureURL to be empty
  const handleAddOpportunity = (doc) => {
    const model = doc;
    model.picture = pictureURL;
    handleAdd(model);
    setPictureURL('');
  };

  // console.log(opportunityTypeNames);
  const schema = new SimpleSchema({
    name: String,
    description: String,
    opportunityType: { type: String, allowedValues: opportunityTypeNames, defaultValue: opportunityTypeNames[0] },
    sponsor: { type: String, allowedValues: sponsorNames, defaultValue: sponsorNames[0] },
    terms: Array,
    'terms.$': { type: String, allowedValues: termNames },
    interests: Array,
    'interests.$': { type: String, allowedValues: interestNames },
    eventDate: { type: Date, optional: true },
    ice: iceSchema,
    retired: { type: Boolean, optional: true },
    picture: { type: String, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Add Opportunity</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={(doc) => handleAddOpportunity(doc)} ref={(ref) => formRef = ref} showInlineError>
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
          <Form.Input name="picture" label="Picture" value={pictureURL} onChange={handlePictureUrlChange} />
          <Form.Button basic color="green" onClick={handleUploadPicture}>
            Upload
          </Form.Button>
        </Form.Group>
        <SubmitField className="mini basic green" value="Add" disabled={false} inputRef={undefined} />
      </AutoForm>
    </Segment>
  );
};

export default AddOpportunityForm;
