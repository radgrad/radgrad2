import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Accordion, Icon, Form, Button, Grid } from 'semantic-ui-react';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { IMentorQuestion, IRadGradMatch } from '../../../typings/radgrad';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Users } from '../../../api/user/UserCollection';

interface IMentorMentorSpaceAnswerFormState {
  activeIndex: number;
  textArea: string;
}

interface IMentorMentorSpaceAnswerFormProps {
  question: IMentorQuestion;
  match: IRadGradMatch;
}

class MentorMentorSpaceAnswerForm extends React.Component<IMentorMentorSpaceAnswerFormProps, IMentorMentorSpaceAnswerFormState> {

  constructor(props) {
    super(props);
    const answer = this.existingAnswer();
    this.state = {
      activeIndex: -1,
      textArea: answer,
    };
  }

  private getUserIdFromRoute() {
    const username = this.props.match.params.username;
    return username && Users.getID(username);
  }

  private mentorID(mentorID) {
    return Users.getID(mentorID);
  }

  private existingAnswer() {
    const questionID = this.props.question._id;
    const existingAnswers = MentorAnswers.find({ questionID, mentorID: this.getUserIdFromRoute() }).fetch();
    return (existingAnswers.length > 0) ? existingAnswers[0].text : '';
  }

  private handleEdit = (e, { value }) => {
    this.setState({ textArea: value });
  }

  private handleSubmit = (doc) => {
    doc.preventDefault();
    const answer = this.state.textArea;
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
    const existingAnswer = this.existingAnswer();
    return (
      <div>
            <Accordion fluid={true} styled={true} style={accordionStyle} key={0}>
              <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                <Icon name="dropdown"/> {'Add or update your answer (markdown supported)'}
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <Form>
                  <Form.TextArea onChange={this.handleEdit} value={this.state.textArea} id={'msanswer'} name={'msanswer'} style={{ minHeight: 175 }}/>
                </Form><br/>
                <Grid.Row>
                  <Button basic color='green' content='Submit' onClick={this.handleSubmit}/>
                  {
                    existingAnswer ?
                      <Button basic color='red' content='Delete' onClick={this.handleDelete}/>
                      : ''
                  }
                </Grid.Row>
              </Accordion.Content>
            </Accordion>
      </div>
    );
  }
}
export default withRouter(MentorMentorSpaceAnswerForm);
