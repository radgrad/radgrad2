import React, { useState } from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, LongTextField, DateField, BoolField, SubmitField, NumField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { IAcademicTerm, IBaseProfile, IInterest, IOpportunityType } from '../../../../../typings/radgrad';
import { academicTermToName, docToName, profileToName } from '../../../shared/utilities/data-model';
import { iceSchema } from '../../../../../api/ice/IceProcessor';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import { openCloudinaryWidget } from '../../../shared/OpenCloudinaryWidget';

interface IAddOpportunityFormProps {
  sponsors: IBaseProfile[];
  terms: IAcademicTerm[];
  interests: IInterest[];
  opportunityTypes: IOpportunityType[];
  formRef: React.RefObject<unknown>;
  handleAdd: (doc) => any;
}

const AddOpportunityForm: React.FC<IAddOpportunityFormProps> = ({ sponsors, formRef, handleAdd, interests, terms, opportunityTypes }) => {
  const [pictureURL, setPictureURL] = useState<string>('');
  const sponsorNames = _.map(sponsors, profileToName);
  const termNames = _.map(terms, academicTermToName);
  const opportunityTypeNames = _.map(opportunityTypes, docToName);
  const interestNames = _.map(interests, docToName);
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
    slug: String,
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
      <AutoForm schema={formSchema} onSubmit={(doc) => handleAddOpportunity(doc)} ref={formRef} showInlineError>
        <Form.Group widths="equal">
          <TextField name="slug" />
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
        <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined} />
      </AutoForm>
    </Segment>
  );
};

export default AddOpportunityForm;
