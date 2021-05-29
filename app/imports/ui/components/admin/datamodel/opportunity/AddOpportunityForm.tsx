import React, { useState } from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import {
  AutoForm,
  TextField,
  SelectField,
  LongTextField,
  DateField,
  BoolField,
  SubmitField,
  NumField,
  ErrorsField,
} from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { Opportunities } from '../../../../../api/opportunity/OpportunityCollection';
import slugify from '../../../../../api/slug/SlugCollection';
import { AcademicTerm, BaseProfile, Interest, OpportunityType } from '../../../../../typings/radgrad';
import PictureField from '../../../form-fields/PictureField';
import {
  academicTermNameToSlug,
  academicTermToName,
  docToName, opportunityTypeNameToSlug, profileNameToUsername,
  profileToName,
} from '../../../shared/utilities/data-model';
import { iceSchema } from '../../../../../api/ice/IceProcessor';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import { interestSlugFromName } from '../../../shared/utilities/form';
import RadGradAlerts from '../../../../utilities/RadGradAlert';

interface AddOpportunityFormProps {
  sponsors: BaseProfile[];
  terms: AcademicTerm[];
  interests: Interest[];
  opportunityTypes: OpportunityType[];
}

// Technical Debt: Picture part of the form is different than the AddUserForm.

const RadGradAlert = new RadGradAlerts();

const AddOpportunityForm: React.FC<AddOpportunityFormProps> = ({ sponsors, interests, terms, opportunityTypes }) => {
  const [pictureURL, setPictureURL] = useState<string>('');
  const sponsorNames = sponsors.map(profileToName);
  const termNames = terms.map(academicTermToName);
  const opportunityTypeNames = opportunityTypes.map(docToName);
  const interestNames = interests.map(docToName);

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
    // console.log(definitionData);
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => {
        RadGradAlert.failure('Failed adding User', error.message, 2500, error);
      })
      .then(() => {
        RadGradAlert.success('Add User Succeeded', '', 1500);
        formRef.reset();
      });
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
    eventDate1: { type: Date, optional: true },
    eventDateLabel1: { type: String, optional: true },
    eventDate2: { type: Date, optional: true },
    eventDateLabel2: { type: String, optional: true },
    eventDate3: { type: Date, optional: true },
    eventDateLabel3: { type: String, optional: true },
    eventDate4: { type: Date, optional: true },
    eventDateLabel4: { type: String, optional: true },
    ice: iceSchema,
    retired: { type: Boolean, optional: true },
    picture: { type: String, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Add Opportunity</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={(doc) => handleAddOpportunity(doc)} ref={(ref) => formRef = ref}
        showInlineError>
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
        <PictureField name="picture" />
        <ErrorsField />
        <SubmitField className="mini basic green" value="Add" disabled={false} inputRef={undefined} />
        <ErrorsField />
      </AutoForm>
    </Segment>
  );
};

export default AddOpportunityForm;
