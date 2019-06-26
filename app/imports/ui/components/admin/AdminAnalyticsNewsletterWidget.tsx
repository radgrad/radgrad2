import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Header, Grid, Form, Button, Label, Checkbox } from "semantic-ui-react";
import AutoForm from 'uniforms-semantic/AutoForm';
import LongTextField from 'uniforms-semantic/LongTextField';
import TextField from 'uniforms-semantic/TextField';
import BoolField from 'uniforms-semantic/BoolField';
import NumField from 'uniforms-semantic/NumField';
import SimpleSchema from 'simpl-schema';
import AdminAnalyticsNewsletterMessagePreviewWidget from "./AdminAnalyticsNewsletterMessagePreviewWidget";
import Swal from "sweetalert2";

const schema = new SimpleSchema({
  inputMessage: String,
  bcc: { type: String, optional: true },
  subjectLine: String,
  studentEmails: { type: String, optional: true, label: 'Student Emails' },
  level: { type: SimpleSchema.Integer, allowedValues: [1, 2, 3, 4, 5, 6], optional: true },
  sendToStudentsToo: { type: Boolean, optional: true },
  sendToLevels: { type: Boolean, optional: true },
  sendToAll: { type: Boolean, optional: true },
})
const options = [
  { key: '1', text: 'Level 1', value: 1 },
  { key: '2', text: 'Level 2', value: 2 },
  { key: '3', text: 'Level 3', value: 3 },
  { key: '4', text: 'Level 4', value: 4 },
  { key: '5', text: 'Level 5', value: 5 },
  { key: '6', text: 'Level 6', value: 6 },
]

interface IAdminAnalyticsNewsletterWidget {

}


interface IAdminAnalyticsNewsletterWidgetState {
  inputMessage: string,
  onSubmitInputMessage: string,
  bcc: string,
  subjectLine: string,
  studentEmails: string,
  sendToStudentsToo: boolean,
  level: number,
  sendToLevels: boolean,
  sendToAll: boolean,
  message: object,
}


class AdminAnalyticsNewsletterWidget extends React.Component<IAdminAnalyticsNewsletterWidget, IAdminAnalyticsNewsletterWidgetState> {
  constructor(props) {
    super(props)
    this.state = {
      inputMessage: '',
      onSubmitInputMessage: '',
      bcc: '',
      subjectLine: '',
      studentEmails: '',
      sendToStudentsToo: false,
      level: 0,
      sendToLevels: false,
      sendToAll: false,
      message: {},
    }
  }

  /**Auto Forms*/
  // check on this https://stackoverflow.com/questions/38558200/react-setstate-not-updating-immediately
  private handleChangeText = (name, value) => {
    console.log('handle change', name, value);
    let intermediateState = {};
    intermediateState[name] = value;
    console.log(intermediateState);
    this.setState(intermediateState);
    // console.log('after set state',this.state);
  }

  private onClickPreviewSave = () => {
    // put in conditional to check if subject has been entered
    console.log('on Click preview ')
    this.setState({ onSubmitInputMessage: this.state.inputMessage });
    console.log(this.state);
  }


  private onClickSendToStudentsToo = () => {
    if (this.state.sendToStudentsToo == true && this.state.onSubmitInputMessage.length !== 0) {
      this.setState({
        message: {
          subjectLine: this.state.subjectLine,
          bcc: this.state.bcc,
          inputMessage: this.state.onSubmitInputMessage,
          studentEmails: this.state.studentEmails
        }
      });
      console.log('after set state', this.state.message);
      this.generateEmail(this.state.message);
      Swal.fire(
        'Good Job!'
      )
    } else {
      Swal.fire(
        'You forgot to fill something out!'
      )
    }


  }

  private generateEmail = (message) => {
    console.log('generate emails', message);
  }

  public render() {
    console.log('after set state public render', this.state);
    console.log(this.state.message);
    return (
      <div>
        AutoForms
        <Segment padded={true}>
          <Header dividing as='h4'>NEWSLETTER OPTIONS</Header>
          <AutoForm schema={schema} onChange={this.handleChangeText}>
            <TextField name='subjectLine'/>
            <TextField name='bcc'/>
            <Form.Group widths='equal'>
              <LongTextField name='inputMessage'/>
              <div>
                <AdminAnalyticsNewsletterMessagePreviewWidget message={this.state.onSubmitInputMessage}/>
              </div>
            </Form.Group>
            <Button basic color='green' onClick={this.onClickPreviewSave}>Preview And Save</Button>
            <Header as='h4' dividing>SEND NEWSLETTER</Header>
            <TextField name='studentEmails'/>
            <BoolField name='sendToStudentsToo'></BoolField>
            <Button basic color='green' onClick={this.onClickSendToStudentsToo}>Send To Admin</Button>
            <NumField name='level'/>
            <BoolField name='sendToLevels'/>
            <Button basic color='green'>Send To Students</Button>
            <BoolField name='sendToAll'/>
            <Button basic color='green'>Send To All</Button>
          </AutoForm>
        </Segment>
      </div>
    )
  }
}

export default withRouter(AdminAnalyticsNewsletterWidget);
