import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Header, Segment } from 'semantic-ui-react';
import { AutoForm, NumField, SelectField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import moment from 'moment';
import { profileToUsername } from '../../../shared/utilities/data-model';

interface IAddAcademicYearInstanceProps {
  students: Meteor.User[];
  formRef: React.RefObject<unknown>;
  handleAdd: (doc) => any;
}

const AddAcademicYearInstanceForm: React.FC<IAddAcademicYearInstanceProps> = ({ students, formRef, handleAdd }) => {
  const studentNames = _.map(students, profileToUsername);
  const schema = new SimpleSchema({
    student: {
      type: String,
      allowedValues: studentNames,
    },
    year: { type: SimpleSchema.Integer, min: 2009, max: 2050, defaultValue: moment().year() },
  });
  const formSchema = new SimpleSchema2Bridge(schema);

  return (
    <Segment padded>
      <Header dividing>Add Academic Year Instance</Header>
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={formRef} showInlineError>
        <NumField name="year" />
        <SelectField name="student" />
        <SubmitField className="basic green" value="Add" />
      </AutoForm>
    </Segment>
  );
};

export default AddAcademicYearInstanceForm;
