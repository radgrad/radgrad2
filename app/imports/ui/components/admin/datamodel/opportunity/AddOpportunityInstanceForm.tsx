import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, BoolField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import RadGradAlert from '../../../../utilities/RadGradAlert';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { OpportunityInstances } from '../../../../../api/opportunity/OpportunityInstanceCollection';
import { Slugs } from '../../../../../api/slug/SlugCollection';
import { AcademicTerm, BaseProfile, Opportunity, OpportunityInstanceDefine, StudentProfile } from '../../../../../typings/radgrad';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import {
  academicTermNameToDoc,
  academicTermToName,
  docToName, opportunityNameToSlug, profileNameToUsername,
  profileToName,
} from '../../../shared/utilities/data-model';

interface AddOpportunityInstanceFormProps {
  terms: AcademicTerm[];
  opportunities: Opportunity[];
  students: StudentProfile[];
  sponsors: BaseProfile[];
}

const AddOpportunityInstanceForm: React.FC<AddOpportunityInstanceFormProps> = ({
  terms,
  opportunities,
  students,
  sponsors,
}) => {
  const termNames = terms.map(academicTermToName);
  const currentTermName = AcademicTerms.toString(AcademicTerms.getCurrentTermID(), false);
  const opportunityNames = opportunities.map(docToName);
  const studentNames = students.map(profileToName);
  const sponsorNames = sponsors.map(profileToName);
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
  let formRef;
  const handleAdd = (doc) => {
    // console.log('OpportunityInstances.handleAdd(%o)', doc);
    const collectionName = OpportunityInstances.getCollectionName();
    const academicTermDoc = academicTermNameToDoc(doc.term);
    const academicTerm = Slugs.getNameFromID(academicTermDoc.slugID);
    const opportunity = opportunityNameToSlug(doc.opportunity);
    const student = profileNameToUsername(doc.student);
    const sponsor = profileNameToUsername(doc.sponsor);
    const definitionData: OpportunityInstanceDefine = { academicTerm, opportunity, sponsor, student, verified: doc.verified, retired: doc.retired };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => { RadGradAlert.failure('Add failed', error.message, error);})
      .then(() => {
        RadGradAlert.success('Add succeeded');
        formRef.reset();
      });
  };

  // console.log(termNames, courseNames, studentNames);
  return (
    <Segment padded>
      <Header dividing>Add Opportunity Instance</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={(ref) => formRef = ref} showInlineError>
        <Form.Group widths="equal">
          <SelectField id={COMPONENTIDS.DATA_MODEL_ACADEMIC_TERM} name="term" />
          <SelectField id={COMPONENTIDS.DATA_MODEL_STUDENT} name="student" />
        </Form.Group>
        <Form.Group widths="equal">
          <SelectField id={COMPONENTIDS.DATA_MODEL_OPPORTUNITY} name="opportunity" />
          <SelectField id={COMPONENTIDS.DATA_MODEL_SPONSOR} name="sponsor" />
        </Form.Group>
        <Form.Group widths="equal">
          <BoolField id={COMPONENTIDS.DATA_MODEL_VERIFIED} name="verified" />
          <BoolField id={COMPONENTIDS.DATA_MODEL_RETIRED} name="retired" />
        </Form.Group>
        <SubmitField id={COMPONENTIDS.DATA_MODEL_SUBMIT} className="mini basic green" value="Add" disabled={false} inputRef={undefined} />
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
      </AutoForm>
    </Segment>
  );
};

export default AddOpportunityInstanceForm;
