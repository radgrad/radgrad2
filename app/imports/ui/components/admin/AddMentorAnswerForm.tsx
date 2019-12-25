import React from 'react';
import { Meteor } from 'meteor/meteor'; // eslint-disable-line
import { Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { IMentorQuestion } from '../../../typings/radgrad'; // eslint-disable-line
import { profileToName } from '../shared/data-model-helper-functions';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';

interface IAddMentorAnswerFormProps {
  mentors: Meteor.User[];
  questions: IMentorQuestion[],
  formRef: any;
  handleAdd: (doc) => any;
}

const AddMentorAnswerForm = (props: IAddMentorAnswerFormProps): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined => {
  const mentorNames = _.map(props.mentors, profileToName);
  const questions = _.map(props.questions, (q) => q.question);
  const schema = new SimpleSchema({
    mentor: { type: String, allowedValues: mentorNames, defaultValue: mentorNames[0] },
    question: { type: String, allowedValues: questions, defaultValue: questions[0] },
    text: String,
    retired: { type: Boolean, optional: true },
  });
  return (
    <Segment padded={true}>
      <Header dividing={true}>Add Mentor Answer</Header>
      <AutoForm schema={schema} onSubmit={props.handleAdd} ref={props.formRef}>
        <Form.Group widths="equal">
          <SelectField name="mentor"/>
          <SelectField name="question"/>
        </Form.Group>
        <LongTextField name="text"/>
        <BoolField name="retired"/>
        <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined}/>
      </AutoForm>
    </Segment>
  );
};

const AddMentorAnswerFormContainer = withTracker(() => {
  const mentors = MentorProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const questions = MentorQuestions.find({}, { sort: { question: 1 } }).fetch();
  return {
    mentors,
    questions,
  };
})(AddMentorAnswerForm);

export default AddMentorAnswerFormContainer;
