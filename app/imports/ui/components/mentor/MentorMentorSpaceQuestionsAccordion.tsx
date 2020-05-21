import React, { useState } from 'react';
import { Accordion, Icon, Grid, Divider, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import MentorQuestionAnswerWidget from '../student/MentorQuestionAnswerWidget';
import MentorMentorSpaceAnswerForm from './MentorMentorSpaceAnswerForm';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { IMentorAnswer, IMentorQuestion } from '../../../typings/radgrad';

interface IMentorMentorSpaceQuestionsAccordionProps {
  answers: IMentorAnswer[];
  questions: IMentorQuestion[];
  index: number;
  answerCount: number;
}

const MentorMentorSpaceQuestionsAccordion = (props: IMentorMentorSpaceQuestionsAccordionProps) => {
  const [activeIndexState, setActiveIndex] = useState(-1);

  const handleClick = (e, titleProps) => {
    e.preventDefault();
    const { index } = titleProps;
    const newIndex = activeIndexState === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const { questions, answers, answerCount } = props;
  const accordionStyle = { overflow: 'hidden' };
  return (
    <div>
      {_.map(questions, (q, ind) => {
        const mentorAnswers = _.filter(answers, (ans) => ans.questionID === q._id);
        return (
          <Segment key={ind}>
            <Accordion fluid styled key={ind} style={accordionStyle}>
              <Accordion.Title active={activeIndexState === ind} index={ind} onClick={handleClick}>
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
            <Divider />
            <MentorMentorSpaceAnswerForm question={q} />
          </Segment>
        );
      })}
    </div>
  );
};

const MentorMentorSpaceQuestionsAccordionContainer = withTracker(() => {
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
})(MentorMentorSpaceQuestionsAccordion);
export default MentorMentorSpaceQuestionsAccordionContainer;
