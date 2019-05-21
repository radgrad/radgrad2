import * as React from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import QuestionAnswersWidget from './QuestionAnswersWidget';

interface IStudentMentorSpaceQuestionsAccordionState {
  active: boolean;
}

interface IStudentMentorSpaceQuestionsAccordionProps {
  questions: any[];
}

class StudentMentorSpaceQuestionsAccordion extends React.Component<IStudentMentorSpaceQuestionsAccordionProps, IStudentMentorSpaceQuestionsAccordionState> {
  constructor(props) {
    super(props);
    this.state = { active: false };
  }

  public handleClick = () => {
    let { active } = this.state;
    active = !active;
    this.setState({ active });
  }

  public render() {
    return (
      <div>
      {_.map(this.props.questions, (q, index) => (
            <Accordion fluid={true} styled={true} key={index}>
              <Accordion.Title active={this.state.active} onClick={this.handleClick}>
                <Icon name="dropdown"/>
                {q.question}
              </Accordion.Title>
              <Accordion.Content active={this.state.active}>
                <QuestionAnswersWidget question={q}/>
              </Accordion.Content>
            </Accordion>
        ))}
      </div>
    );
  }
}

const StudentMentorSpaceQuestionsAccordionContainer = withTracker(() => {
  const questions = MentorQuestions.find().fetch();
  // console.log('StudentMentorSpaceQuestionAccordion withTracker items=%o', questions);
  return {
    questions,
  };
})(StudentMentorSpaceQuestionsAccordion);
export default StudentMentorSpaceQuestionsAccordionContainer;
