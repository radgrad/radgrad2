import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import {
  AutoForm,
  TextField,
  SelectField,
  LongTextField,
  BoolField,
  SubmitField,
  NumField,
  ErrorsField,
} from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { BaseProfile, Interest, OpportunityType } from '../../../../../typings/radgrad';
import BaseCollection from '../../../../../api/base/BaseCollection';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import DayField from '../../../form-fields/DayField';
import PictureField from '../../../form-fields/PictureField';
import {
  docToName,
  interestIdToName,
  opportunityTypeIdToName,
  profileToName,
  userIdToName,
} from '../../../shared/utilities/data-model';
import { iceSchema } from '../../../../../api/ice/IceProcessor';
import MultiSelectField from '../../../form-fields/MultiSelectField';

interface UpdateOpportunityFormProps {
  sponsors: BaseProfile[];
  interests: Interest[];
  opportunityTypes: OpportunityType[];
  collection: BaseCollection;
  id: string;
  handleUpdate: (doc) => void;
  handleCancel: (event) => void;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateOpportunityForm: React.FC<UpdateOpportunityFormProps> = ({
  sponsors,
  opportunityTypes,
  interests,
  handleUpdate,
  handleCancel,
  itemTitleString,
  collection,
  id,
}) => {
  const model = collection.findDoc(id);

  // console.log('collection model = %o', model);
  model.opportunityType = opportunityTypeIdToName(model.opportunityTypeID);
  model.interests = model.interestIDs.map(interestIdToName);
  model.sponsor = userIdToName(model.sponsorID);
  // console.log(model);
  const sponsorNames = sponsors.map(profileToName);
  // console.log(terms, termNames);
  const opportunityTypeNames = opportunityTypes.map(docToName);
  const interestNames = interests.map(docToName);
  // console.log(opportunityTypeNames);
  const schema = new SimpleSchema({
    name: { type: String, optional: true },
    description: { type: String, optional: true },
    opportunityType: { type: String, allowedValues: opportunityTypeNames, optional: true },
    sponsor: { type: String, allowedValues: sponsorNames, optional: true },
    interests: { type: Array, optional: true },
    'interests.$': { type: String, allowedValues: interestNames },
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
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Update Opportunity : {itemTitleString(model)}</Header>
      <AutoForm schema={formSchema} onSubmit={(doc) => handleUpdate(doc)} showInlineError model={model}>
        <Form.Group widths="equal">
          <TextField name="name"/>
        </Form.Group>
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
        <SubmitField inputRef={undefined} disabled={false} value="Update" className="mini basic green"/>
        <Button onClick={handleCancel} basic color="green" size="mini">Cancel</Button>
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
      </AutoForm>
    </Segment>
  );
};

export default UpdateOpportunityForm;
