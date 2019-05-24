import * as React from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import AutoForm from 'uniforms-semantic/AutoForm';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { moment } from "meteor/momentjs:moment";
import { defineMethod } from "../../../api/base/BaseCollection.methods";
import Swal from "sweetalert2";
import { IMentorAnswer, IMentorQuestion } from "../../../typings/radgrad";

interface IMentorMentorSpaceAnswerFormState {
  activeIndex: number;
}

interface IMentorMentorSpaceAnswerFormProps {
  question: IMentorQuestion;
  index: number;
  answer: IMentorAnswer[];
  match: {
    params: {
      username: string;
    };
  };
}

class MentorMentorSpaceAnswerForm extends React.Component<IMentorMentorSpaceAnswerFormProps, IMentorMentorSpaceAnswerFormState> {
  private readonly formRef: any;
  constructor(props) {
    super(props);
    this.state = { activeIndex: -1 };
    this.formRef = React.createRef();
  }

  public handleClick = (e, titleProps) => {
    e.preventDefault();
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
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

  public render() {
    const { activeIndex } = this.state;
    const accordionStyle = { overflow: 'hidden' };
    const schema = new SimpleSchema({
      question: String,
    });
    const answer = _.filter(this.props.answer, (ans) => ans.questionID === this.props.question._id);
    return (
      <div>
        {_.map(answer, (a, ind) => (
            <Accordion fluid={true} styled={true} key={ind} style={accordionStyle}>
              <Accordion.Title active={activeIndex === ind} index={ind} onClick={this.handleClick}>
                <Icon name="dropdown"/> {`Add or update your answer (markdown supported)`}
              </Accordion.Title>
              <Accordion.Content active={activeIndex === ind}>
                <AutoForm schema={schema} onSubmit={this.handleSubmit} ref={this.formRef}>
                  <LongTextField name="question"/>
                  <SubmitField/>
                </AutoForm>
              </Accordion.Content>
            </Accordion>
        ))}
      </div>
    );
  }
}

const MentorMentorSpaceAnswerFormContainer = withTracker(() => {
  const question = MentorQuestions.find().fetch();
  const answer = MentorAnswers.find().fetch();
  // console.log('QuestionAnswersWidget withTracker items=%o', answers);
  return {
    question,
    answer,
  };
})(MentorMentorSpaceAnswerForm);
export default MentorMentorSpaceAnswerFormContainer;
