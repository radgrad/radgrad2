import React from 'react';
import { Divider, Image, List } from 'semantic-ui-react';
import { IMentorAnswer, IMentorProfile } from '../../../typings/radgrad'; // eslint-disable-line
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
    this.setState({ isActive: !this.state.isActive });
  }

  public render() {
    const { answer, mentor } = this.props;
    const { isActive } = this.state;
    return (
      <React.Fragment>
        <Divider/>
        <List horizontal={true} relaxed={true}>
          <List.Item>
            <Image src={mentor.picture} size={'mini'}/>
            <List.Content>
              <a onClick={this.toggleFullSize}>{mentor.firstName} {mentor.lastName} </a> answered:
              <ExplorerUsersWidget userProfile={mentor} isActive={isActive}
                                   handleClose={this.toggleFullSize}/>
            </List.Content>
          </List.Item>
        </List>
        <p>{answer.text}</p>
      </React.Fragment>
    );
  }
}

export default MentorQuestionAnswerWidget;
