import * as React from 'react';
import { Meteor } from 'meteor/meteor'; // eslint-disable-line
import { Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import NumField from 'uniforms-semantic/NumField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { ROLE } from '../../../api/role/Role';
import { profileToUsername } from '../shared/data-model-helper-functions';

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

  return (
    <Segment padded={true}>
      <Header dividing={true}>Add Academic Year Instance</Header>
      <AutoForm schema={schema} onSubmit={props.handleAdd} ref={props.formRef} showInlineError={true}>
        <NumField name="year"/>
        <SelectField name="student"/>
        <SubmitField className="basic green" value="Add"/>
      </AutoForm>
    </Segment>
  );
};

const AddAcademicYearInstanceFormContainer = withTracker(() => {
  const students = Roles.getUsersInRole(ROLE.STUDENT).fetch();
  // console.log('students=%o', students);
  return {
    students,
  };
})(AddAcademicYearInstanceForm);

export default AddAcademicYearInstanceFormContainer;
