import * as React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import { moment } from 'meteor/momentjs:moment';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

interface IStudentMentorSpaceQuestionFormProps {
  match: {
    params: {
      username: string;
    };
  };
}

class StudentMentorSpaceQuestionForm extends React.Component<IStudentMentorSpaceQuestionFormProps> {
  private readonly formRef: any;
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  private handleSubmit = (doc) => {
    const collectionName = MentorQuestions.getCollectionName();
    const question = doc.question;
    const student = this.props.match.params.username;
    const slug = `${student}${moment().format('YYYYMMDDHHmmssSSSSS')}`;
    const definitionData = { question, slug, student };
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Add failed',
          text: error.message,
          type: 'error',
        });
      } else {
        Swal.fire({
          title: 'Add succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        this.formRef.current.reset();
      }
    });
  }

  public public;

  public render()
    :
    React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const schema = new SimpleSchema({
      question: String,
    });
    return (
      <Segment padded={true}>
        <Header dividing={true}><h4>ASK A NEW QUESTION</h4></Header>
        <AutoForm schema={schema} onSubmit={this.handleSubmit} ref={this.formRef}>
          <LongTextField name="question"/>
          <SubmitField/>
        </AutoForm>
      </Segment>
    );
  }
}

export default withRouter(StudentMentorSpaceQuestionForm);
