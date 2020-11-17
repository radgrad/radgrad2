import React from 'react';
import _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import { AutoForm, SelectField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { IAcademicTerm, IOpportunity, IOpportunityInstance, IStudentProfile } from '../../../../../typings/radgrad';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import {
  academicTermToName,
  docToName,
  opportunityInstanceToName,
  profileToName,
} from '../../../shared/utilities/data-model';
import { VerificationRequests } from '../../../../../api/verification/VerificationRequestCollection';

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
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Add Verification Request</Header>
      <AutoForm schema={formSchema} onSubmit={props.handleAdd} ref={props.formRef} showInlineError>
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

export default AddVerificationRequestForm;
