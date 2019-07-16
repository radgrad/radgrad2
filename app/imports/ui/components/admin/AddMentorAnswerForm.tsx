import * as React from 'react';
import { Meteor } from 'meteor/meteor'; // eslint-disable-line
import { Form, Header, Segment } from 'semantic-ui-react';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'; // eslint-disable-line no-unused-vars
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { IMentorQuestion } from '../../../typings/radgrad'; // eslint-disable-line
import { profileToName } from '../shared/AdminDataModelHelperFunctions';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';

interface IAddMentorAnswerFormProps {
  mentors: Meteor.User[];
  questions: IMentorQuestion[],
  formRef: any;
  handleAdd: (doc) => any;
}

class AddMentorAnswerForm extends React.Component<IAddMentorAnswerFormProps> {
  constructor(props) {
    super(props);
    // console.log('AddMentorAnswerForm props=%o', props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const mentorNames = _.map(this.props.mentors, profileToName);
    const questions = _.map(this.props.questions, (q) => q.question);
    const schema = new SimpleSchema({
      mentor: { type: String, allowedValues: mentorNames, defaultValue: mentorNames[0] },
      question: { type: String, allowedValues: questions, defaultValue: questions[0] },
      text: String,
      retired: { type: Boolean, optional: true },
    });
    return (
      <Segment padded={true}>
        <Header dividing={true}>Add Mentor Answer</Header>
        <AutoForm schema={schema} onSubmit={this.props.handleAdd} ref={this.props.formRef}>
          <Form.Group widths="equal">
          <SelectField name="mentor"/>
          <SelectField name="question"/>
          </Form.Group>
          <LongTextField name="text"/>
          <BoolField name="retired"/>
          <SubmitField className="basic green" value="Add"/>
        </AutoForm>
      </Segment>
    );
  }
}

const AddMentorAnswerFormContainer = withTracker(() => {
  const mentors = MentorProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const questions = MentorQuestions.find({}, { sort: { question: 1 } }).fetch();
  return {
    mentors,
    questions,
  };
})(AddMentorAnswerForm);

export default AddMentorAnswerFormContainer;
