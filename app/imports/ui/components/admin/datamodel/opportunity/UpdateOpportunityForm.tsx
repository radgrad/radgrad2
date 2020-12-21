import React, { useState } from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, LongTextField, DateField, BoolField, SubmitField, NumField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { AcademicTerm, BaseProfile, Interest, OpportunityType } from '../../../../../typings/radgrad';
import BaseCollection from '../../../../../api/base/BaseCollection';
import {
  academicTermIdToName,
  academicTermToName,
  docToName, interestIdToName,
  opportunityTypeIdToName,
  profileToName, userIdToName,
} from '../../../shared/utilities/data-model';
import { iceSchema } from '../../../../../api/ice/IceProcessor';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import { openCloudinaryWidget } from '../../../shared/OpenCloudinaryWidget';

interface UpdateOpportunityFormProps {
  sponsors: BaseProfile[];
  terms: AcademicTerm[];
  interests: Interest[];
  opportunityTypes: OpportunityType[];
  collection: BaseCollection;
  id: string;
  formRef: React.RefObject<unknown>;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateOpportunityForm: React.FC<UpdateOpportunityFormProps> = ({ sponsors, opportunityTypes, terms, interests, formRef, handleUpdate, handleCancel, itemTitleString, collection, id }) => {
  const model = collection.findDoc(id);
  const [pictureURL, setPictureURL] = useState(model.picture);
  const handleUploadPicture = async (e): Promise<void> => {
    e.preventDefault();
    try {
      const cloudinaryResult = await openCloudinaryWidget();
      if (cloudinaryResult.event === 'success') {
        setPictureURL(cloudinaryResult.info.url);
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

  const handleUpdateOpportunity = (doc) => {
    const mod = doc;
    mod.picture = pictureURL;
    handleUpdate(mod);
  };

  // console.log('collection model = %o', model);
  model.opportunityType = opportunityTypeIdToName(model.opportunityTypeID);
  model.interests = _.map(model.interestIDs, interestIdToName);
  model.terms = _.map(model.termIDs, academicTermIdToName);
  model.sponsor = userIdToName(model.sponsorID);
  // console.log(model);
  const sponsorNames = _.map(sponsors, profileToName);
  const termNames = _.map(terms, academicTermToName);
  const opportunityTypeNames = _.map(opportunityTypes, docToName);
  const interestNames = _.map(interests, docToName);
  // console.log(opportunityTypeNames);
  const schema = new SimpleSchema({
    name: { type: String, optional: true },
    description: { type: String, optional: true },
    opportunityType: { type: String, allowedValues: opportunityTypeNames, optional: true },
    sponsor: { type: String, allowedValues: sponsorNames, optional: true },
    terms: { type: Array, optional: true },
    'terms.$': { type: String, allowedValues: termNames },
    interests: { type: Array, optional: true },
    'interests.$': { type: String, allowedValues: interestNames },
    eventDate: { type: Date, optional: true },
    ice: { type: iceSchema, optional: true },
    retired: { type: Boolean, optional: true },
    picture: { type: String, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Update Opportunity : {itemTitleString(model)}</Header>
      <AutoForm
        schema={formSchema}
        onSubmit={(doc) => handleUpdateOpportunity(doc)}
        ref={formRef}
        showInlineError
        model={model}
      >
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
          <Form.Button basic color="green" onClick={handleUploadPicture}>Upload</Form.Button>
        </Form.Group>
        <SubmitField inputRef={undefined} disabled={false} value="Update" className="" />
        <Button onClick={handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateOpportunityForm;
