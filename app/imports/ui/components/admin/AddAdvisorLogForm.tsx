import React from 'react';
import { Meteor } from 'meteor/meteor'; // eslint-disable-line
import 'uniforms-bridge-simple-schema-2';
import { Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, LongTextField, SubmitField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { profileToUsername } from '../shared/data-model-helper-functions';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';

interface IAddAdvisorLogFormProps {
  advisors: Meteor.User[];
  students: Meteor.User[];
  formRef: any;
  handleAdd: (doc) => any;
}

const AddAdvisorLogForm = (props: IAddAdvisorLogFormProps): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined => {
  console.log('AddAdvisorLogForm', props);
  const advisorNames = _.map(props.advisors, profileToUsername);
  const studentNames = _.map(props.students, profileToUsername);
  // console.log(advisorNames, studentNames);
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
        <SubmitField className="basic green" value="Add"/>
      </AutoForm>
    </Segment>
  );
};

const AddAdvisorLogFormContainer = withTracker(() => {
  const advisors = AdvisorProfiles.findNonRetired({}, { $sort: { lastName: 1, firstName: 1 } });
  const students = StudentProfiles.findNonRetired({ isAlumni: false }, { $sort: { lastName: 1, firstName: 1 } });
  console.log('advisors=%o students=%o', advisors, students);
  return {
    advisors,
    students,
  };
})(AddAdvisorLogForm);

export default AddAdvisorLogFormContainer;
