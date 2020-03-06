import React from 'react';
import { Divider, Image, List } from 'semantic-ui-react';
import { IMentorAnswer, IMentorProfile } from '../../../typings/radgrad';
import ExplorerUsersWidget from '../shared/ExplorerUsersWidget';

interface IQuestionAnswersWidgetProps {
  mentor: IMentorProfile;
  answer: IMentorAnswer;
}

interface IQuestionAnswersWidgetState {
  isActive: boolean;
}

class MentorQuestionAnswerWidget extends React.Component<IQuestionAnswersWidgetProps, IQuestionAnswersWidgetState> {
  constructor(props) {
    super(props);
    this.state = { isActive: false };
  }

  private toggleFullSize = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const newState = !this.state.isActive;
    this.setState({ isActive: newState });
  }

  public render() {
    const { answer, mentor } = this.props;
    const { isActive } = this.state;
    return (
      <React.Fragment>
        <Divider />
        <List horizontal relaxed>
          <List.Item>
            <Image src={mentor.picture} size="mini" />
            <List.Content>
              <button type="button" onClick={this.toggleFullSize}>
                {mentor.firstName}
                {' '}
                {mentor.lastName}
                {' '}
              </button>
              {' '}
              answered:
              <ExplorerUsersWidget
                userProfile={mentor}
                isActive={isActive}
                handleClose={this.toggleFullSize}
              />
            </List.Content>
          </List.Item>
        </List>
        <p>{answer.text}</p>
      </React.Fragment>
    );
  }
}

export default MentorQuestionAnswerWidget;
