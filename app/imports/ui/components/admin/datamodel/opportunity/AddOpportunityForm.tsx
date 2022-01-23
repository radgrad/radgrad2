import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, LongTextField, BoolField, SubmitField, NumField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { Opportunities } from '../../../../../api/opportunity/OpportunityCollection';
import slugify from '../../../../../api/slug/SlugCollection';
import { BaseProfile, Interest, OpportunityDefine, OpportunityType } from '../../../../../typings/radgrad';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import DayField from '../../../form-fields/DayField';
import PictureField from '../../../form-fields/PictureField';
import { docToName, opportunityTypeNameToSlug, profileNameToUsername, profileToName } from '../../../shared/utilities/data-model';
import { iceSchema } from '../../../../../api/ice/IceProcessor';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import { interestSlugFromName } from '../../../shared/utilities/form';
import RadGradAlert from '../../../../utilities/RadGradAlert';

interface AddOpportunityFormProps {
  sponsors: BaseProfile[];
  interests: Interest[];
  opportunityTypes: OpportunityType[];
}

// Technical Debt: Picture part of the form is different than the AddUserForm.

const AddOpportunityForm: React.FC<AddOpportunityFormProps> = ({ sponsors, interests, opportunityTypes }) => {
  const sponsorNames = sponsors.map(profileToName);
  const opportunityTypeNames = opportunityTypes.map(docToName);
  const interestNames = interests.map(docToName);

  let formRef;
  const handleAdd = (doc) => {
    // console.log('Opportunities.handleAdd(%o)', doc);
    const collectionName = Opportunities.getCollectionName();
    const definitionData: OpportunityDefine = {
      name: doc.name,
      description: doc.description,
      slug: `${slugify(doc.name)}-opportunity`,
      interests: doc.interests.map(interestSlugFromName),
      opportunityType: opportunityTypeNameToSlug(doc.opportunityType),
      sponsor: profileNameToUsername(doc.sponsor),
      ice: doc.ice,
      picture: doc.picture,
      retired: doc.retired,
    };
    // console.log(definitionData);
    defineMethod
      .callPromise({ collectionName, definitionData })
      .catch((error) => {
        RadGradAlert.failure('Failed adding Opportunity', error.message, error);
      })
      .then(() => {
        RadGradAlert.success('Add Opportunity Succeeded');
        formRef?.reset(); // CAM getting an error in TestCafe tests so adding ?
      });
  };



  // Hacky way of resetting pictureURL to be empty
  const handleAddOpportunity = (doc, fRef) => {
    fRef.reset();
    handleAdd(doc);
  };

  // console.log(opportunityTypeNames);
  const schema = new SimpleSchema({
    name: String,
    description: String,
    opportunityType: { type: String, allowedValues: opportunityTypeNames, defaultValue: opportunityTypeNames[0] },
    sponsor: { type: String, allowedValues: sponsorNames, defaultValue: sponsorNames[0] },
    interests: Array,
    'interests.$': { type: String, allowedValues: interestNames },
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
      <AutoForm schema={formSchema} onSubmit={(doc) => handleAddOpportunity(doc, formRef)} ref={(ref) => (formRef = ref)} showInlineError>
        <TextField id={COMPONENTIDS.DATA_MODEL_NAME} name="name" />
        <Form.Group widths="equal">
          <SelectField id={COMPONENTIDS.DATA_MODEL_OPPORTUNITY_TYPE} name="opportunityType" />
          <SelectField id={COMPONENTIDS.DATA_MODEL_SPONSOR} name="sponsor" />
        </Form.Group>
        <LongTextField id={COMPONENTIDS.DATA_MODEL_DESCRIPTION} name="description" />
        <MultiSelectField id={COMPONENTIDS.DATA_MODEL_INTERESTS} name="interests" />
        <PictureField id={COMPONENTIDS.DATA_MODEL_PICTURE} name="picture" />
        <Form.Group widths="equal">
          <DayField id={COMPONENTIDS.DATA_MODEL_EVENT_DATE_1} name="eventDate1" />
          <TextField id={COMPONENTIDS.DATA_MODEL_EVENT_DATE_1_LABEL} name="eventDateLabel1" />
          <DayField id={COMPONENTIDS.DATA_MODEL_EVENT_DATE_2} name="eventDate2" />
          <TextField id={COMPONENTIDS.DATA_MODEL_EVENT_DATE_2_LABEL} name="eventDateLabel2" />
        </Form.Group>
        <Form.Group widths="equal">
          <DayField id={COMPONENTIDS.DATA_MODEL_EVENT_DATE_3} name="eventDate3" />
          <TextField id={COMPONENTIDS.DATA_MODEL_EVENT_DATE_3_LABEL} name="eventDateLabel3" />
          <DayField id={COMPONENTIDS.DATA_MODEL_EVENT_DATE_4} name="eventDate4" />
          <TextField id={COMPONENTIDS.DATA_MODEL_EVENT_DATE_4_LABEL} name="eventDateLabel4" />
        </Form.Group>
        <Form.Group widths="equal">
          <NumField id={COMPONENTIDS.DATA_MODEL_ICE_I} name="ice.i" />
          <NumField id={COMPONENTIDS.DATA_MODEL_ICE_C} name="ice.c" />
          <NumField id={COMPONENTIDS.DATA_MODEL_ICE_E} name="ice.e" />
        </Form.Group>
        <BoolField id={COMPONENTIDS.DATA_MODEL_RETIRED} name="retired" />
        <ErrorsField />
        <SubmitField id={COMPONENTIDS.DATA_MODEL_SUBMIT} className="mini basic green" value="Add" disabled={false} inputRef={undefined} />
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
      </AutoForm>
    </Segment>
  );
};

export default AddOpportunityForm;
