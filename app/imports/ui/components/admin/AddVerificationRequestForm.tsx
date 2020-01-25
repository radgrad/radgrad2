import React from 'react';
import _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import SimpleSchema from 'simpl-schema';
import { AutoForm, SelectField, BoolField, SubmitField } from 'uniforms-semantic';
import { IAcademicTerm, IOpportunity, IOpportunityInstance, IStudentProfile } from '../../../typings/radgrad';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import {
  academicTermToName,
  docToName,
  opportunityInstanceToName,
  profileToName,
} from '../shared/data-model-helper-functions';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';

interface IAddVerificationRequestFormProps {
  students: IStudentProfile[];
  academicTerms: IAcademicTerm[];
  opportunities: IOpportunity[];
  opportunityInstances: IOpportunityInstance[];
  formRef: any;
  handleAdd: (doc) => any;
}

const AddVerificationRequestForm = (props: IAddVerificationRequestFormProps) => {
  const termNames = _.map(props.academicTerms, academicTermToName);
  const currentTermName = AcademicTerms.toString(AcademicTerms.getCurrentTermID(), false);
  const opportunityNames = _.map(props.opportunities, docToName);
  const opportunityInstanceNames = _.map(props.opportunityInstances, opportunityInstanceToName);
  const studentNames = _.map(props.students, profileToName);
  const schema = new SimpleSchema({
    student: { type: String, allowedValues: studentNames, optional: true },
    status: {
      type: String,
      optional: true,
      allowedValues: [VerificationRequests.OPEN, VerificationRequests.ACCEPTED, VerificationRequests.REJECTED],
    },
    academicTerm: { type: String, optional: true, allowedValues: termNames, defaultValue: currentTermName },
    opportunityInstance: { type: String, optional: true, allowedValues: opportunityInstanceNames },
    opportunity: { type: String, optional: true, allowedValues: opportunityNames },
    retired: { type: Boolean, optional: true },
  });
  return (
    <Segment padded>
      <Header dividing>Add Verification Request</Header>
      <AutoForm schema={schema} onSubmit={props.handleAdd} ref={props.formRef} showInlineError>
        <Form.Group widths="equal">
          <SelectField name="student" placeholder="Choose the student" />
          <SelectField name="status" placeholder="Choose the status" />
        </Form.Group>
        <Form.Group widths="equal">
          <SelectField name="opportunityInstance" />
          <SelectField name="opportunity" />
          <SelectField name="academicTerm" />
        </Form.Group>
        <BoolField name="retired" />
        <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined} />
      </AutoForm>
    </Segment>
  );
};

const AddVerificationRequestFormContainer = withTracker(() => {
  const students = StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const academicTerms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const opportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
  const opportunityInstances = OpportunityInstances.find().fetch();
  return {
    students,
    academicTerms,
    opportunities,
    opportunityInstances,
  };
})(AddVerificationRequestForm);

export default AddVerificationRequestFormContainer;
