import * as React from 'react';
import { Accordion, Icon, Form, Button, Grid } from 'semantic-ui-react';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { withTracker } from 'meteor/react-meteor-data';
import { IMentorAnswer, IMentorQuestion } from '../../../typings/radgrad';
import { _ } from "meteor/erasaur:meteor-lodash";
import { MentorProfiles } from "../../../api/user/MentorProfileCollection";

interface IMentorMentorSpaceAnswerFormState {
  activeIndex: number;
}

interface IMentorMentorSpaceAnswerFormProps {
  question: IMentorQuestion;
  index: number;
  answer: IMentorAnswer[];
}

class MentorMentorSpaceAnswerForm extends React.Component<IMentorMentorSpaceAnswerFormProps, IMentorMentorSpaceAnswerFormState> {

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
    const answer = _.filter(this.props.answer, (ans) => ans.questionID === this.props.question._id);
    return (
      <div>
        {_.map(answer, (a, ind) => {
          const mentor = MentorProfiles.findDoc({ userID: a.mentorID });
          return (
            <Accordion fluid={true} styled={true} style={accordionStyle} key={ind}>
              <Accordion.Title active={activeIndex === ind} index={ind} onClick={this.handleClick}>
                <Icon name="dropdown"/> {`Add or update your answer (markdown supported)`}
              </Accordion.Title>
              <Accordion.Content active={activeIndex === ind}>
                <Form>
                  <Form.TextArea value={a.text} style={{ minHeight: 175 }}/>
                </Form><br/>
                <Grid.Row>
                  <Button basic color='green' content='Submit'/>
                  <Button basic color='red' content='Delete'/>
                </Grid.Row>
              </Accordion.Content>
            </Accordion>
          );
        })}
      </div>
    );
  }
}

const MentorMentorSpaceAnswerFormContainer = withTracker(() => {
  const answer = MentorAnswers.find().fetch();
  // console.log('QuestionAnswersWidget withTracker items=%o', answer);
  return {
    answer,
  };
})(MentorMentorSpaceAnswerForm);
export default MentorMentorSpaceAnswerFormContainer;
