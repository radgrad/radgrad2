import * as React from 'react';
import { Divider, Image, List } from 'semantic-ui-react';
import { IMentorQuestion, IMentorAnswer, IMentorProfile } from '../../../typings/radgrad'; // eslint-disable-line

interface IQuestionAnswersWidgetProps {
  mentor: any;
  answer: any;
}

class QuestionAnswersWidget extends React.Component<IQuestionAnswersWidgetProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const answer = this.props.answer;
    console.log('Answer: ', this.props.answer);
    const mentor = this.props.mentor;
    return (
      <React.Fragment>
        <Divider/>
        <List horizontal={true} relaxed={true}>
          <List.Item>
            <Image src={mentor.picture} size={'mini'}/>
            <List.Content>
              <a href="#">{mentor.firstName} {mentor.lastName} </a> answered:
            </List.Content>
          </List.Item>
        </List>
        <p>{answer.text}</p>
      </React.Fragment>
    );
  }
}

export default QuestionAnswersWidget;
