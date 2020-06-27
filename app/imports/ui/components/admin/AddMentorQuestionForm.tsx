import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, TextField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { IStudentProfile } from '../../../typings/radgrad';
import { profileToName } from '../shared/data-model-helper-functions';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';

interface IAddMentorQuestionFormProps {
  students: IStudentProfile[];
  formRef: any;
  handleAdd: (doc) => any;
}

const AddMentorQuestionForm = (props: IAddMentorQuestionFormProps) => {
  const studentNames = _.map(props.students, profileToName);
  const schema = new SimpleSchema({
    student: { type: String, allowedValues: studentNames, defaultValue: studentNames[0] },
    slug: String,
    question: String,
    moderatorComments: { type: String, optional: true },
    moderated: { type: Boolean, optional: true },
    visible: { type: Boolean, optional: true },
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Add Mentor Question</Header>
      <AutoForm schema={formSchema} onSubmit={props.handleAdd} ref={props.formRef}>
        <Form.Group widths="equal">
          <SelectField name="student" />
          <TextField name="slug" placeholder="question-student-0" />
        </Form.Group>
        <LongTextField name="question" />
        <LongTextField name="moderatorComments" />
        <Form.Group widths="equal">
          <BoolField name="moderated" />
          <BoolField name="visible" />
          <BoolField name="retired" />
        </Form.Group>
        <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined} />
      </AutoForm>
    </Segment>
  );
};

const AddMentorQuestionFormContainer = withTracker(() => {
  const students = StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  return {
    students,
  };
})(AddMentorQuestionForm);

export default AddMentorQuestionFormContainer;
