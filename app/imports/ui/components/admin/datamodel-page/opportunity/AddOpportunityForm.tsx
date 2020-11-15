import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, LongTextField, DateField, BoolField, SubmitField, NumField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { IAcademicTerm, IBaseProfile, IInterest, IOpportunityType } from '../../../../../typings/radgrad';
import { academicTermToName, docToName, profileToName } from '../../../shared/data-model-helper-functions';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import { FacultyProfiles } from '../../../../../api/user/FacultyProfileCollection';
import { AdvisorProfiles } from '../../../../../api/user/AdvisorProfileCollection';
import { OpportunityTypes } from '../../../../../api/opportunity/OpportunityTypeCollection';
import { iceSchema } from '../../../../../api/ice/IceProcessor';
import { Interests } from '../../../../../api/interest/InterestCollection';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import { openCloudinaryWidget } from '../../../shared/OpenCloudinaryWidget';

interface IAddOpportunityFormProps {
  sponsors: IBaseProfile[];
  terms: IAcademicTerm[];
  interests: IInterest[];
  opportunityTypes: IOpportunityType[];
  formRef: any;
  handleAdd: (doc) => any;
}

const AddOpportunityForm = (props: IAddOpportunityFormProps) => {
  const [pictureURL, setPictureURL] = useState<string>('');
  // console.log(props);
  const sponsorNames = _.map(props.sponsors, profileToName);
  const termNames = _.map(props.terms, academicTermToName);
  const opportunityTypeNames = _.map(props.opportunityTypes, docToName);
  const interestNames = _.map(props.interests, docToName);
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
    props.handleAdd(model);
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
      <AutoForm schema={formSchema} onSubmit={(doc) => handleAddOpportunity(doc)} ref={props.formRef} showInlineError>
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

const AddOpportunityTypeFormContainer = withTracker(() => {
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  // const currentTermNumber = AcademicTerms.getCurrentAcademicTermDoc().termNumber;
  // const after = currentTermNumber - 8;
  // const before = currentTermNumber + 16;
  // console.log(currentTermNumber, after, before);
  const allTerms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  // const terms = _.filter(allTerms, t => t.termNumber >= after && t.termNumber <= before);
  const terms = allTerms;
  // console.log(terms);
  const faculty = FacultyProfiles.find({}).fetch();
  const advisors = AdvisorProfiles.find({}).fetch();
  const sponsorDocs = _.union(faculty, advisors);
  const sponsors = _.sortBy(sponsorDocs, ['lastName', 'firstName']);
  const opportunityTypes = OpportunityTypes.find({}, { sort: { name: 1 } }).fetch();
  return {
    sponsors,
    terms,
    opportunityTypes,
    interests,
  };
})(AddOpportunityForm);

export default AddOpportunityTypeFormContainer;
