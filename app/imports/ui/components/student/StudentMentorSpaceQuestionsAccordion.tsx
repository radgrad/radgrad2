import React, { useState } from 'react';
import { Accordion, Grid, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import MentorQuestionAnswerWidget from './MentorQuestionAnswerWidget';
import { IMentorAnswer, IMentorQuestion } from '../../../typings/radgrad';

interface IStudentMentorSpaceQuestionsAccordionProps {
  answers: IMentorAnswer[];
  questions: IMentorQuestion[];
  answerCount: number;
}

const StudentMentorSpaceQuestionsAccordion = (props: IStudentMentorSpaceQuestionsAccordionProps) => {
  const [activeIndexState, setActiveIndex] = useState(-1);

  const handleClick = (e, titleProps) => {
    e.preventDefault();
    const { index } = titleProps;
    const newIndex = activeIndexState === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const accordionStyle = { overflow: 'hidden' };
  const { questions, answers, answerCount } = props;
  return (
    <div>
      {_.map(questions, (q, ind) => {
        const mentorAnswers = _.filter(answers, (ans) => ans.questionID === q._id);
        return (
          <Accordion fluid styled key={ind} style={accordionStyle}>
            <Accordion.Title active={activeIndexState === ind} index={ind} onClick={handleClick}>
              <Grid columns="equal">
                <Grid.Row>
                  <Grid.Column>
                    <Icon name="dropdown" />
                    {q.question}
                  </Grid.Column>
                  <Grid.Column width={3} textAlign="right">
                    {answerCount[ind]} {answerCount[ind] > 1 ? ' answers' : ' answer'}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Accordion.Title>
            <Accordion.Content active={activeIndexState === ind}>
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
};

const StudentMentorSpaceQuestionsAccordionContainer = withTracker(() => {
  const questions = MentorQuestions.findNonRetired({});
  const answerCount = _.map(questions, (q) => MentorAnswers.findNonRetired({ questionID: q._id }).length);
  const answers = MentorAnswers.findNonRetired({});
  return {
    questions,
    answerCount,
    answers,
  };
})(StudentMentorSpaceQuestionsAccordion);
export default StudentMentorSpaceQuestionsAccordionContainer;
