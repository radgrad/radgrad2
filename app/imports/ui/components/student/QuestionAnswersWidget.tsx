import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Divider, Image, List } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { IMentorQuestion, IMentorAnswer } from '../../../typings/radgrad'; // eslint-disable-line
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';

interface IQuestionAnswersWidgetProps {
  question: IMentorQuestion;
  answers: IMentorAnswer[];
}

class QuestionAnswersWidget extends React.Component<IQuestionAnswersWidgetProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const answers = _.filter(this.props.answers, (ans) => ans.questionID === this.props.question._id);
    return (
      <div>
        {_.map(answers, (a, index) => {
          const mentor = MentorProfiles.findDoc({ userID: a.mentorID });
          return (
          <div key={index}>
            <Divider/>
            <List horizontal={true} relaxed={true}>
              <List.Item>
                <Image src={mentor.picture} size={'mini'}/>
                <List.Content>
                  <a href="#">{mentor.firstName} {mentor.lastName} </a> answered:
                </List.Content>
              </List.Item>
            </List>
            <p>{a.text}</p>
          </div>
          );
        })}
      </div>
    );
  }
}

const QuestionAnswersWidgetContainer = withTracker(() => {
  const answers = MentorAnswers.find().fetch();
  // console.log('QuestionAnswersWidget withTracker items=%o', answers);
  return {
    answers,
  };
})(QuestionAnswersWidget);
export default QuestionAnswersWidgetContainer;
