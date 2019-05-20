import * as React from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';

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
      <Accordion fluid={true} styled={true}>
        <Accordion.Title active={this.state.active} onClick={this.handleClick}>
          <Icon name="dropdown"/>
          Title goes here.
        </Accordion.Title>
        <Accordion.Content active={this.state.active}>
          Answers go here.
        </Accordion.Content>
      </Accordion>
    );
  }
}

const StudentMentorSpaceQuestionsAccordionContainer = withTracker(() => {
  const questions = MentorQuestions.find().fetch();
  console.log('StudentMentorSpaceQuestionAccordion withTracker items=%o', questions);
  return {
    questions,
  };
})(StudentMentorSpaceQuestionsAccordion);
export default StudentMentorSpaceQuestionsAccordionContainer;
