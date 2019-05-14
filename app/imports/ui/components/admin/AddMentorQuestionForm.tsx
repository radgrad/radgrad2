import * as React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import TextField from 'uniforms-semantic/TextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { IMentorQuestion, IStudentProfile } from '../../../typings/radgrad'; // eslint-disable-line
import { profileToName } from '../shared/AdminDataModelHelperFunctions';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';

interface IAddMentorQuestionFormProps {
  students: IStudentProfile[];
  formRef: any;
  handleAdd: (doc) => any;
}

class AddMentorQuestionForm extends React.Component<IAddMentorQuestionFormProps> {
  constructor(props) {
    super(props);
    // console.log('AddMentorQuestionForm props=%o', props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const studentNames = _.map(this.props.students, profileToName);
    const schema = new SimpleSchema({
      student: { type: String, allowedValues: studentNames, defaultValue: studentNames[0] },
      slug: String,
      question: String,
      moderatorComments: { type: String, optional: true },
      moderated: { type: Boolean, optional: true },
      visible: { type: Boolean, optional: true },
      retired: { type: Boolean, optional: true },
    });
    return (
      <Segment padded={true}>
        <Header dividing={true}>Add Mentor Question</Header>
        <AutoForm schema={schema} onSubmit={this.props.handleAdd} ref={this.props.formRef}>
          <Form.Group widths="equal">
            <SelectField name="student"/>
            <TextField name="slug"/>
          </Form.Group>
          <LongTextField name="question"/>
          <LongTextField name="moderatorComments"/>
          <Form.Group widths="equal">
            <BoolField name="moderated"/>
            <BoolField name="visible"/>
          <BoolField name="retired"/>
          </Form.Group>
          <SubmitField/>
        </AutoForm>
      </Segment>
    );
  }
}

const AddMentorQuestionFormContainer = withTracker(() => {
  const students = StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  return {
    students,
  };
})(AddMentorQuestionForm);

export default AddMentorQuestionFormContainer;
