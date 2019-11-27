import * as React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoField from 'uniforms-semantic/AutoField';
import BoolField from 'uniforms-semantic/BoolField';
import DateField from 'uniforms-semantic/DateField';
import LongTextField from 'uniforms-semantic/LongTextField';
import TextField from 'uniforms-semantic/TextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { IAcademicTerm, IBaseProfile, IInterest, IOpportunityType } from '../../../typings/radgrad'; // eslint-disable-line
import { academicTermToName, docToName, profileToName } from '../shared/data-model-helper-functions';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { iceSchema } from '../../../api/ice/IceProcessor';
import { Interests } from '../../../api/interest/InterestCollection';
import MultiSelectField from '../shared/MultiSelectField';

interface IAddOpportunityFormProps {
  sponsors: IBaseProfile[];
  terms: IAcademicTerm[];
  interests: IInterest[];
  opportunityTypes: IOpportunityType[];
  formRef: any;
  handleAdd: (doc) => any;
}

const AddOpportunityForm = (props: IAddOpportunityFormProps) => {
  // console.log(props);
  const sponsorNames = _.map(props.sponsors, profileToName);
  const termNames = _.map(props.terms, academicTermToName);
  const opportunityTypeNames = _.map(props.opportunityTypes, docToName);
  const interestNames = _.map(props.interests, docToName);
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
  });
  return (
    <Segment padded={true}>
      <Header dividing={true}>Add Opportunity</Header>
      <AutoForm schema={schema} onSubmit={props.handleAdd} ref={props.formRef} showInlineError={true}>
        <Form.Group widths="equal">
          <TextField name="slug"/>
          <TextField name="name"/>
        </Form.Group>
        <Form.Group widths="equal">
          <SelectField name="opportunityType"/>
          <SelectField name="sponsor"/>
        </Form.Group>
        <LongTextField name="description"/>
        <Form.Group widths="equal">
          <MultiSelectField name="terms"/>
          <MultiSelectField name="interests"/>
        </Form.Group>
        <DateField name="eventDate"/>
        <AutoField name="ice"/>
        <BoolField name="retired"/>
        <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined}/>
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
