import React from 'react';
import _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { IAcademicTerm, IBaseProfile, IOpportunity, IStudentProfile } from '../../../../../typings/radgrad';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import { academicTermToName, docToName, profileToName } from '../../../shared/utilities/data-model';

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

export default AddOpportunityInstanceForm;
