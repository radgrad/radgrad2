import * as React from 'react';
import { Accordion, Icon, Form, Button, Grid } from 'semantic-ui-react';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { IMentorAnswer, IMentorQuestion } from '../../../typings/radgrad';
import { _ } from "meteor/erasaur:meteor-lodash";
import { MentorProfiles } from "../../../api/user/MentorProfileCollection";
import { defineMethod, updateMethod, removeItMethod } from "../../../api/base/BaseCollection.methods";
import { Users } from "../../../api/user/UserCollection";

interface IMentorMentorSpaceAnswerFormState {
  activeIndex: number;
}

interface IMentorMentorSpaceAnswerFormProps {
  question: IMentorQuestion;
  index: number;
  answer: IMentorAnswer[];
  match: {
    params: {
      username: string;
    };
  };
}

class MentorMentorSpaceAnswerForm extends React.Component<IMentorMentorSpaceAnswerFormProps, IMentorMentorSpaceAnswerFormState> {

  constructor(props) {
    super(props);
    this.state = { activeIndex: -1 };
  }

  private getUserIdFromRoute() {
    const username = this.props.match.params.username;
    return username && Users.getID(username);
  }

  private existingAnswer() {
    const questionID = this.props.question._id;
    const existingAnswers = MentorAnswers.find({ questionID, mentorID: this.getUserIdFromRoute() }).fetch();
    return (existingAnswers.length > 0) ? existingAnswers[0].text : '';
  }

  private handleSubmit = (doc) => {
    doc.preventDefault();
    const answer = doc.target.msanswer.value;
    const question = this.props.question._id;
    const collectionName = MentorAnswers.getCollectionName();
    const newAnswer: any = { question, mentor: this.getUserIdFromRoute(), text: answer };
    const existingAnswers = MentorAnswers.find({ questionID: question, mentorID: this.getUserIdFromRoute() }).fetch();
    const answerExists = (existingAnswers.length > 0);
    if (answerExists) {
      newAnswer.id = existingAnswers[0]._id;
      updateMethod.call({ collectionName, updateData: newAnswer }, (error) => {
        if (error) console.log('error in MentorAnswers.update', error);
      });
    } else {
      defineMethod.call({ collectionName, definitionData: newAnswer }, (error) => {
        if (error) console.log('error in MentorAnswers.define', error);
      });
    }
  }

  private handleDelete = (doc) => {
    doc.preventDefault();
    const questionID = this.props.question._id;
    const collectionName = MentorAnswers.getCollectionName();
    const instance = MentorAnswers.findDoc({ questionID, mentorID: this.getUserIdFromRoute() })._id;
    removeItMethod.call({ collectionName, instance });
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
    const student = this.props.match.params.username;
    console.log("params: ", student);
    return (
      <div>
        {_.map(answer, (a, ind) => {
          const mentor = MentorProfiles.findDoc({ userID: a.mentorID });
          const mentorUsername = mentor.username;
          return (
            <Accordion fluid={true} styled={true} style={accordionStyle} key={ind}>
              <Accordion.Title active={activeIndex === ind} index={ind} onClick={this.handleClick}>
                <Icon name="dropdown"/> {`Add or update your answer (markdown supported)`}
              </Accordion.Title>
              <Accordion.Content active={activeIndex === ind}>
                <Form onSubmit={this.handleSubmit}>
                  <Form.TextArea value={a.text} style={{ minHeight: 175 }}/>
                </Form><br/>
                <Grid.Row>
                  <Button basic color='green' content='Submit' onClick={this.handleSubmit}/>
                  <Button basic color='red' content='Delete' onClick={this.handleDelete}/>
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
export default withRouter(MentorMentorSpaceAnswerFormContainer);
