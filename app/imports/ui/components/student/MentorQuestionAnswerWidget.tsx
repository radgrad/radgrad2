import React, { useState } from 'react';
import { Divider, Image, List } from 'semantic-ui-react';
import { IMentorAnswer, IMentorProfile } from '../../../typings/radgrad';
import ExplorerUsersWidget from '../shared/ExplorerUsersWidget';

interface IQuestionAnswersWidgetProps {
  mentor: IMentorProfile;
  answer: IMentorAnswer;
}

const MentorQuestionAnswerWidget = (props: IQuestionAnswersWidgetProps) => {
  const [isActiveState, setIsActive] = useState(false);

  const toggleFullSize = () => {
    setIsActive(!isActiveState);
  };

  const { answer, mentor } = props;
  return (
    <React.Fragment>
      <Divider />
      <List horizontal relaxed>
        <List.Item>
          <Image src={mentor.picture} size="mini" />
          <List.Content>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <a onClick={toggleFullSize}>
              {mentor.firstName}
              {' '}
              {mentor.lastName}
              {' '}
            </a>
            {' '}
            answered:
            <ExplorerUsersWidget
              userProfile={mentor}
              isActive={isActiveState}
              handleClose={toggleFullSize}
            />
          </List.Content>
        </List.Item>
      </List>
      <p>{answer.text}</p>
    </React.Fragment>
  );
};

export default MentorQuestionAnswerWidget;
