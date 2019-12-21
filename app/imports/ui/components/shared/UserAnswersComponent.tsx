import * as React from 'react';
import * as _ from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import { Accordion, Card, Header } from 'semantic-ui-react';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { ROLE } from '../../../api/role/Role';
import { Users } from '../../../api/user/UserCollection';
import { IRadGradMatch } from '../../../typings/radgrad';

interface IUserAnswersComponentProps {
  userID: string;
  match: IRadGradMatch;
}

/**
 * Roles that are allowed access to the Mentor Space
 */
const ALLOWED_ROLES = [
  ROLE.STUDENT,
  ROLE.MENTOR,
];

/**
 * @param userID {string} UserID used to search for answers in the database
 * @return {Card.Component} A component meant to be used on a <Card>.
 */
const UserAnswersComponent = (props: IUserAnswersComponentProps) => {
  const thisUserProfile = Users.findProfileFromUsername(props.match.params.username);
  const mentorAnswers = MentorAnswers.find({ mentorID: props.userID }).fetch(); // TODO: Why is this not reactive?
  const associatedQuestions = mentorAnswers.map((ele) => ({
    question: MentorQuestions.find({ _id: ele.questionID }).fetch()[0].question,
    answer: ele.text,
  }));
  const panels = associatedQuestions.map((ele, i) => ({
    key: i,
    title: ele.question,
    content: ele.answer,
  }));
  return (
    <Card.Content>
      {_.includes(ALLOWED_ROLES, thisUserProfile.role) ?
        <Header as={'h4'}><Link rel={'noopener noreferrer'}
                                to={`/${thisUserProfile.role.toLowerCase()}/${thisUserProfile.username}/mentor-space/`}>MENTOR
          ANSWERS ({mentorAnswers.length})</Link></Header>
        : <Header as={'h4'}>MENTOR ANSWERS ({mentorAnswers.length})</Header>}
      {mentorAnswers.length > 0 ?
        <Accordion fluid exclusive={false}
                   panels={panels}
                   defaultActiveIndex={[-1]}/>
        : undefined}
    </Card.Content>
  );
};

export default withRouter(UserAnswersComponent);
