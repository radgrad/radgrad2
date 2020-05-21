import moment from 'moment';
import faker from 'faker';
import { makeSampleUser } from '../user/SampleUsers';
import { MentorQuestions } from './MentorQuestionCollection';
import { ROLE } from '../role/Role';
import { MentorAnswers } from './MentorAnswerCollection';

export const makeSampleMentorQuestion = () => {
  const question = faker.lorem.paragraph();
  const student = makeSampleUser();
  const slug = `${student}-question-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`;
  return MentorQuestions.define({ question, student, slug });
};

export const makeSampleMentorAnswer = () => {
  const mentor = makeSampleUser(ROLE.MENTOR);
  const text = faker.lorem.paragraph();
  const question = makeSampleMentorQuestion();
  return MentorAnswers.define({ question, mentor, text });
};
