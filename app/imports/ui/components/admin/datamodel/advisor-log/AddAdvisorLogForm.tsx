import React from 'react';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, LongTextField, SubmitField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import { profileToUsername } from '../../../shared/utilities/data-model';

interface IAddAdvisorLogFormProps {
  advisors: Meteor.User[];
  students: Meteor.User[];
  formRef: any;
  handleAdd: (doc) => any;
}

const AddAdvisorLogForm = (props: IAddAdvisorLogFormProps) => {
  // console.log('AddAdvisorLogForm', props);
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
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Add Advisor Log</Header>
      <AutoForm schema={formSchema} onSubmit={props.handleAdd} ref={props.formRef}>
        <SelectField name="advisor" />
        <SelectField name="student" />
        <LongTextField name="text" />
        <SubmitField className="basic green" value="Add" />
      </AutoForm>
    </Segment>
  );
};

export default AddAdvisorLogForm;
