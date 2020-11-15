import React from 'react';
import _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { IAcademicTerm, IBaseProfile, IOpportunity, IStudentProfile } from '../../../../../typings/radgrad';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import { StudentProfiles } from '../../../../../api/user/StudentProfileCollection';
import { academicTermToName, docToName, profileToName } from '../../../shared/data-model-helper-functions';
import { Opportunities } from '../../../../../api/opportunity/OpportunityCollection';
import { FacultyProfiles } from '../../../../../api/user/FacultyProfileCollection';
import { AdvisorProfiles } from '../../../../../api/user/AdvisorProfileCollection';

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
  const formSchema = new SimpleSchema2Bridge(schema);
  // console.log(termNames, courseNames, studentNames);
  return (
    <Segment padded>
      <Header dividing>Add Opportunity Instance</Header>
      <AutoForm schema={formSchema} onSubmit={props.handleAdd} ref={props.formRef} showInlineError>
        <Form.Group widths="equal">
          <SelectField name="term" />
          <SelectField name="student" />
        </Form.Group>
        <Form.Group widths="equal">
          <SelectField name="opportunity" />
          <SelectField name="sponsor" />
        </Form.Group>
        <Form.Group widths="equal">
          <BoolField name="verified" />
          <BoolField name="retired" />
        </Form.Group>
        <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined} />
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
