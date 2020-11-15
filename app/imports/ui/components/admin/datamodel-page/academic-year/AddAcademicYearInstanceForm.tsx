import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Header, Segment } from 'semantic-ui-react';
import { AutoForm, NumField, SelectField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import moment from 'moment';
import { profileToUsername } from '../../../shared/data-model-helper-functions';
import { StudentProfiles } from '../../../../../api/user/StudentProfileCollection';

interface IAddAcademicYearInstanceProps {
  students: Meteor.User[];
  formRef: any;
  handleAdd: (doc) => any;
}

const AddAcademicYearInstanceForm = (props: IAddAcademicYearInstanceProps): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined => {
  const studentNames = _.map(props.students, profileToUsername);
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
      <AutoForm schema={formSchema} onSubmit={props.handleAdd} ref={props.formRef} showInlineError>
        <NumField name="year" />
        <SelectField name="student" />
        <SubmitField className="basic green" value="Add" />
      </AutoForm>
    </Segment>
  );
};

const AddAcademicYearInstanceFormContainer = withTracker(() => {
  const students = StudentProfiles.find({ isAlumni: false }).fetch();
  // console.log('students=%o', students);
  return {
    students,
  };
})(AddAcademicYearInstanceForm);

export default AddAcademicYearInstanceFormContainer;
