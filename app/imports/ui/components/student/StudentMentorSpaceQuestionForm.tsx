import * as React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import * as moment from 'moment';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { studentMentorSpaceAskQuestionWidget } from './student-widget-names';
import { IRadGradMatch } from '../../../typings/radgrad';

interface IStudentMentorSpaceQuestionFormProps {
  match: IRadGradMatch;
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
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Add succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        this.formRef.current.reset();
      }
    });
  }

  public render()
    :
    React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const schema = new SimpleSchema({
      question: String,
    });
    return (
      <Segment padded={true} id={studentMentorSpaceAskQuestionWidget}>
        <Header dividing={true}><h4>ASK A NEW QUESTION</h4></Header>
        <AutoForm schema={schema} onSubmit={this.handleSubmit} ref={this.formRef}>
          <LongTextField name="question"/>
          <SubmitField inputRef={undefined} value={'Ask Question'} disabled={false} className={''}/>
        </AutoForm>
      </Segment>
    );
  }
}

export default withRouter(StudentMentorSpaceQuestionForm);
