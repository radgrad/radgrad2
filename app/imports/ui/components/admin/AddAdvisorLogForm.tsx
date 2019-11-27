import * as React from 'react';
import { Meteor } from 'meteor/meteor'; // eslint-disable-line
import { Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import LongTextField from 'uniforms-semantic/LongTextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { ROLE } from '../../../api/role/Role';
import { profileToUsername } from '../shared/data-model-helper-functions';

interface IAddAdvisorLogFormProps {
  advisors: Meteor.User[];
  students: Meteor.User[];
  formRef: any;
  handleAdd: (doc) => any;
}

const AddAdvisorLogForm = (props: IAddAdvisorLogFormProps): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined => {
  // console.log(props);
  const advisorNames = _.map(props.advisors, profileToUsername);
  const studentNames = _.map(props.students, profileToUsername);
  const schema = new SimpleSchema({
    advisor: {
      type: String,
      allowedValues: advisorNames,
      defaultValue: advisorNames[0],
    },
    student: {
      type: String,
      allowedValues: studentNames,
      defaultValue: studentNames[0],
    },
    text: String,
  });
  return (
    <Segment padded={true}>
      <Header dividing={true}>Add Advisor Log</Header>
      <AutoForm schema={schema} onSubmit={props.handleAdd} ref={props.formRef}>
        <SelectField name="advisor"/>
        <SelectField name="student"/>
        <LongTextField name="text"/>
        <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined}/>
      </AutoForm>
    </Segment>
  );
};

const AddAdvisorLogFormContainer = withTracker(() => {
  const advisors = Roles.getUsersInRole(ROLE.ADVISOR).fetch();
  const students = Roles.getUsersInRole(ROLE.STUDENT).fetch();
  // console.log('advisors=%o students=%o', advisors, students);
  return {
    advisors,
    students,
  };
})(AddAdvisorLogForm);

export default AddAdvisorLogFormContainer;
