import * as React from 'react';
import { Accordion, Icon, Form, Button, Grid } from 'semantic-ui-react';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { withTracker } from 'meteor/react-meteor-data';
import { IMentorAnswer, IMentorQuestion } from "../../../typings/radgrad";

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
    return (
      <div>
        <Accordion fluid={true} styled={true} style={accordionStyle}>
          <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
            <Icon name="dropdown"/> {`Add or update your answer (markdown supported)`}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <Form>
              <Form.TextArea>
              </Form.TextArea>
            </Form><br/>
            <Grid.Row>
              <Button basic color='green' content='Submit'/>
              <Button basic color='red' content='Delete'/>
            </Grid.Row>
          </Accordion.Content>
        </Accordion>
      </div>
    );
  }
}

const MentorMentorSpaceAnswerFormContainer = withTracker(() => {
  const question = MentorQuestions.find().fetch();
  const answer = MentorAnswers.find().fetch();
  // console.log('QuestionAnswersWidget withTracker items=%o', answers);
  return {
    question,
    answer,
  };
})(MentorMentorSpaceAnswerForm);
export default MentorMentorSpaceAnswerFormContainer;
