import React from 'react';
import { Accordion, Grid, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import MentorQuestionAnswerWidget from './MentorQuestionAnswerWidget';
// eslint-disable-next-line no-unused-vars
import { IMentorAnswer, IMentorQuestion } from '../../../typings/radgrad';

interface IStudentMentorSpaceQuestionsAccordionState {
  activeIndex: number;
}

interface IStudentMentorSpaceQuestionsAccordionProps {
  answers: IMentorAnswer[];
  questions: IMentorQuestion[];
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

  public render() {
    const { activeIndex } = this.state;
    const accordionStyle = { overflow: 'hidden' };
    const { questions, answers, answerCount } = this.props;
    return (
      <div>
        {_.map(questions, (q, ind) => {
          const mentorAnswers = _.filter(answers, (ans) => ans.questionID === q._id);
          return (
            <Accordion fluid styled key={ind} style={accordionStyle}>
              <Accordion.Title active={activeIndex === ind} index={ind} onClick={this.handleClick}>
                <Grid columns="equal">
                  <Grid.Row>
                    <Grid.Column>
                      <Icon name="dropdown" />
                      {q.question}
                    </Grid.Column>
                    <Grid.Column width={2} textAlign="right">
                      {answerCount[ind]}
                      {' '}
                      {answerCount[ind] > 1 ? ' answers' : ' answer'}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === ind}>
                <React.Fragment>
                  {_.map(mentorAnswers, (answer, index) => {
                    const mentor = MentorProfiles.findDoc({ userID: answer.mentorID });
                    return (
                      <React.Fragment key={index}>
                        <MentorQuestionAnswerWidget answer={answer} mentor={mentor} />
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              </Accordion.Content>
            </Accordion>
          );
        })}
      </div>
    );
  }
}

const StudentMentorSpaceQuestionsAccordionContainer = withTracker(() => {
  const questions = MentorQuestions.find().fetch();
  const answerCount = _.map(questions, (q) => MentorAnswers.find({ questionID: q._id }).fetch().length);
  const answers = MentorAnswers.find().fetch();
  // console.log('StudentMentorSpaceQuestionAccordion withTracker items=%o', questions);
  // console.log('StudentMentorSpaceQuestionAccordion withTracker items=%o', answerCount);
  return {
    questions,
    answerCount,
    answers,
  };
})(StudentMentorSpaceQuestionsAccordion);
export default StudentMentorSpaceQuestionsAccordionContainer;
