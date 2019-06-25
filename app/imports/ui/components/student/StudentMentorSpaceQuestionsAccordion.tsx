import * as React from 'react';
import { Accordion, Grid, Icon } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import QuestionAnswersWidget from './QuestionAnswersWidget';

interface IStudentMentorSpaceQuestionsAccordionState {
  activeIndex: number;
}

interface IStudentMentorSpaceQuestionsAccordionProps {
  questions: string;
  index: number;
  answerCount: number;
}

class StudentMentorSpaceQuestionsAccordion extends React.Component<IStudentMentorSpaceQuestionsAccordionProps, IStudentMentorSpaceQuestionsAccordionState> {
  constructor(props) {
    super(props);
    this.state = { activeIndex: -1 };
  }

  public handleClick = (e, titleProps) => {
    e.preventDefault();
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  public answerAmt(answerCount) {
    const print1 = ' answer';
    const print2 = ' answers';
    if (answerCount === 1) {
      return print1;
    }
    return print2;
  }

  public render() {
    const { activeIndex } = this.state;
    const accordionStyle = { overflow: 'hidden' };
    return (
      <div>
        {_.map(this.props.questions, (q, ind) => (
          <Accordion fluid={true} styled={true} key={ind} style={accordionStyle}>
            <Accordion.Title active={activeIndex === ind} index={ind} onClick={this.handleClick}>
              <Grid columns='equal'>
                <Grid.Row>
                  <Grid.Column>
                    <Icon name="dropdown"/>
                    {q.question}
                  </Grid.Column>
                  <Grid.Column width={2} textAlign={'right'}>
                    {this.props.answerCount[ind]} {this.answerAmt(this.props.answerCount[ind])}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === ind}>
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
  const answerCount = _.map(questions, (q) => MentorAnswers.find({ questionID: q._id }).fetch().length);
  // console.log('StudentMentorSpaceQuestionAccordion withTracker items=%o', questions);
  // console.log('StudentMentorSpaceQuestionAccordion withTracker items=%o', answerCount);
  return {
    questions,
    answerCount,
  };
})(StudentMentorSpaceQuestionsAccordion);
export default StudentMentorSpaceQuestionsAccordionContainer;
