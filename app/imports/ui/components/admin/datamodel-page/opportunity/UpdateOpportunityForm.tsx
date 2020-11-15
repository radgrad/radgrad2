import React, { useState } from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, LongTextField, DateField, BoolField, SubmitField, NumField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { IAcademicTerm, IBaseProfile, IInterest, IOpportunityType } from '../../../../../typings/radgrad';
import BaseCollection from '../../../../../api/base/BaseCollection';
import {
  academicTermIdToName,
  academicTermToName,
  docToName, interestIdToName,
  opportunityTypeIdToName,
  profileToName, userIdToName,
} from '../../../shared/data-model-helper-functions';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import { FacultyProfiles } from '../../../../../api/user/FacultyProfileCollection';
import { AdvisorProfiles } from '../../../../../api/user/AdvisorProfileCollection';
import { OpportunityTypes } from '../../../../../api/opportunity/OpportunityTypeCollection';
import { iceSchema } from '../../../../../api/ice/IceProcessor';
import { Interests } from '../../../../../api/interest/InterestCollection';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import { openCloudinaryWidget } from '../../../shared/OpenCloudinaryWidget';

interface IUpdateOpportunityFormProps {
  sponsors: IBaseProfile[];
  terms: IAcademicTerm[];
  interests: IInterest[];
  opportunityTypes: IOpportunityType[];
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
}

const UpdateOpportunityForm = (props: IUpdateOpportunityFormProps) => {
  const model = props.collection.findDoc(props.id);
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
    const model = doc;
    model.picture = pictureURL;
    props.handleUpdate(model);
  };

  // console.log('collection model = %o', model);
  model.opportunityType = opportunityTypeIdToName(model.opportunityTypeID);
  model.interests = _.map(model.interestIDs, interestIdToName);
  model.terms = _.map(model.termIDs, academicTermIdToName);
  model.sponsor = userIdToName(model.sponsorID);
  // console.log(model);
  // console.log(props);
  const sponsorNames = _.map(props.sponsors, profileToName);
  const termNames = _.map(props.terms, academicTermToName);
  const opportunityTypeNames = _.map(props.opportunityTypes, docToName);
  const interestNames = _.map(props.interests, docToName);
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
      <Header dividing>Update Opportunity</Header>
      <AutoForm
        schema={formSchema}
        onSubmit={(doc) => handleUpdateOpportunity(doc)}
        ref={props.formRef}
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
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

const UpdateOpportunityTypeFormContainer = withTracker(() => {
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
})(UpdateOpportunityForm);

export default UpdateOpportunityTypeFormContainer;
