import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { AutoForm, LongTextField, SubmitField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { studentMentorSpaceAskQuestionWidget } from './component-names';
import { getUsername } from '../shared/RouterHelperFunctions';
import { UserInteractionsDataType, UserInteractionsTypes } from '../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';

interface IStudentMentorSpaceQuestionFormProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      course: string;
    }
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
    const username = getUsername(this.props.match);
    const slug = `${username}${moment().format('YYYYMMDDHHmmssSSSSS')}`;
    const definitionData = { question, slug, student: username };
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
        const typeData = question.substring(0, 100); // get first 100 characters of question for typeData
        const interactionData: UserInteractionsDataType = {
          username,
          type: UserInteractionsTypes.ASKQUESTION,
          typeData,
        };
        userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
          if (userInteractionError) {
            console.log('Error creating UserInteraction.', userInteractionError);
          }
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
      <Segment padded id={studentMentorSpaceAskQuestionWidget}>
        <Header dividing><h4>ASK A NEW QUESTION</h4></Header>
        <AutoForm schema={schema} onSubmit={this.handleSubmit} ref={this.formRef}>
          <LongTextField name="question" />
          <SubmitField inputRef={undefined} value="Ask Question" disabled={false} className="" />
        </AutoForm>
      </Segment>
    );
  }
}

export default withRouter(StudentMentorSpaceQuestionForm);
