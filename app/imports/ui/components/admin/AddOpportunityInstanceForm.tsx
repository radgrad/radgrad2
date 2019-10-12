import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { IAcademicTerm, IBaseProfile, IOpportunity, IStudentProfile } from '../../../typings/radgrad'; // eslint-disable-line
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { academicTermToName, docToName, profileToName } from '../shared/AdminDataModelHelperFunctions';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';

interface IAddOpportunityInstanceFormProps {
  terms: IAcademicTerm[];
  opportunities: IOpportunity[];
  students: IStudentProfile[];
  sponsors: IBaseProfile[];
  formRef: any;
  handleAdd: (doc) => any;
}

const AddOpportunityInstanceForm = (props: IAddOpportunityInstanceFormProps) => {
  const termNames = _.map(props.terms, academicTermToName);
  const currentTermName = AcademicTerms.toString(AcademicTerms.getCurrentTermID(), false);
  const opportunityNames = _.map(props.opportunities, docToName);
  const studentNames = _.map(props.students, profileToName);
  const sponsorNames = _.map(props.sponsors, profileToName);
  const schema = new SimpleSchema({
    term: {
      type: String,
      allowedValues: termNames,
      defaultValue: currentTermName,
    },
    opportunity: {
      type: String,
      allowedValues: opportunityNames,
      defaultValue: opportunityNames[0],
    },
    student: {
      type: String,
      allowedValues: studentNames,
      defaultValue: studentNames[0],
    },
    sponsor: {
      type: String,
      allowedValues: sponsorNames,
      defaultValue: sponsorNames[0],
    },
    verified: { type: Boolean, optional: true },
    retired: { type: Boolean, optional: true },
  });
  // console.log(termNames, courseNames, studentNames);
  return (
    <Segment padded={true}>
      <Header dividing={true}>Add Opportunity Instance</Header>
      <AutoForm schema={schema} onSubmit={props.handleAdd} ref={props.formRef} showInlineError={true}>
        <Form.Group widths="equal">
          <SelectField name="term"/>
          <SelectField name="student"/>
        </Form.Group>
        <Form.Group widths="equal">
          <SelectField name="opportunity"/>
          <SelectField name="sponsor"/>
        </Form.Group>
        <Form.Group widths="equal">
          <BoolField name="verified"/>
          <BoolField name="retired"/>
        </Form.Group>
        <SubmitField className="basic green" value="Add"/>
      </AutoForm>
    </Segment>
  );
};

const AddOpportunityInstanceFormContainer = withTracker(() => {
  const terms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const opportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
  const students = StudentProfiles.find({}, { sort: { lastName: 1 } }).fetch();
  const faculty = FacultyProfiles.find({}).fetch();
  const advisors = AdvisorProfiles.find({}).fetch();
  const sponsorDocs = _.union(faculty, advisors);
  const sponsors = _.sortBy(sponsorDocs, ['lastName', 'firstName']);
  return {
    terms,
    opportunities,
    students,
    sponsors,
  };
})(AddOpportunityInstanceForm);

export default AddOpportunityInstanceFormContainer;
