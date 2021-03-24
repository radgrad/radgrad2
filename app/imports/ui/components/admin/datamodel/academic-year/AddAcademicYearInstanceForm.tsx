import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Header, Segment } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { AutoForm, NumField, SelectField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { AcademicYearInstances } from '../../../../../api/degree-plan/AcademicYearInstanceCollection';
import { profileToUsername } from '../../../shared/utilities/data-model';

interface AddAcademicYearInstanceProps {
  students: Meteor.User[];
}

const AddAcademicYearInstanceForm: React.FC<AddAcademicYearInstanceProps> = ({ students }) => {
  const studentNames = students.map(profileToUsername);
  const schema = new SimpleSchema({
    student: {
      type: String,
      allowedValues: studentNames,
    },
    year: { type: SimpleSchema.Integer, min: 2009, max: 2050, defaultValue: moment().year() },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  let formRef;
  const callback = (ref) => (error) => {
    if (error) {
      Swal.fire({
        title: 'Add failed',
        text: error.message,
        icon: 'error',
      });
    } else {
      Swal.fire({
        title: 'Add succeeded',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      ref.reset();
    }
  };

  const handleAdd = (doc) => {
    const collectionName = AcademicYearInstances.getCollectionName();
    const definitionData = doc;
    defineMethod.call({ collectionName, definitionData }, callback(formRef));
  };


  return (
    <Segment padded>
      <Header dividing>Add Academic Year Instance</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={(ref) => formRef = ref} showInlineError>
        <NumField name="year" />
        <SelectField name="student" />
        <SubmitField className="basic green" value="Add" />
      </AutoForm>
    </Segment>
  );
};

export default AddAcademicYearInstanceForm;
