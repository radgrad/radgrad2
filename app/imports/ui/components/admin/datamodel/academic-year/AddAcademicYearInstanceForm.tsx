import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Header, Segment } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { AcademicYearInstances } from '../../../../../api/degree-plan/AcademicYearInstanceCollection';
import { AcademicYearInstanceDefine } from '../../../../../typings/radgrad';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import { profileToName } from '../../../shared/utilities/data-model';
import RadGradAlert from '../../../../utilities/RadGradAlert';

interface AddAcademicYearInstanceProps {
  students: Meteor.User[];
}

const AddAcademicYearInstanceForm: React.FC<AddAcademicYearInstanceProps> = ({ students }) => {
  const studentNames = students.map(profileToName);
  const schema = new SimpleSchema({
    student: {
      type: String,
      allowedValues: studentNames,
    },
    year: { type: SimpleSchema.Integer, min: 2009, max: 2050, defaultValue: moment().year() },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  let formRef;
  const handleAdd = (doc) => {
    const collectionName = AcademicYearInstances.getCollectionName();
    const student = doc.student.substring(doc.student.indexOf('(') + 1, doc.student.indexOf(')'));
    const definitionData: AcademicYearInstanceDefine = { year: doc.year, student }; // We can do this since we don't change any of the fields in doc.
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => { RadGradAlert.failure('Add failed', error.message, error);})
      .then(() => {
        RadGradAlert.success('Add succeeded');
        formRef.reset();
      });
  };

  return (
    <Segment padded>
      <Header dividing>Add Academic Year Instance</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={(ref) => formRef = ref} showInlineError>
        <NumField id={COMPONENTIDS.DATA_MODEL_YEAR} name="year" />
        <SelectField id={COMPONENTIDS.DATA_MODEL_STUDENT} name="student" />
        <SubmitField id={COMPONENTIDS.DATA_MODEL_SUBMIT} className="mini basic green" value="Add" />
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
      </AutoForm>
    </Segment>
  );
};

export default AddAcademicYearInstanceForm;
