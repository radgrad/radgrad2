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
    let intermediateState = {};
    intermediateState[name] = value;
    this.setState(intermediateState, () => {
      console.log('callback from set state handle change', this.state);
    });
  }

  private onClickPreviewSave = () => {
    // put in conditional to check if subject has been entered
    this.setState({ onSubmitInputMessage: this.state.inputMessage });
    console.log(this.state);
  }


  private onClickSendStudentsToo = () => {
    if (this.state.onSubmitInputMessage.length !== 0 && this.state.subjectLine.length !== 0) {
      this.setState({
        message: {
          subjectLine: this.state.subjectLine,
          bcc: this.state.bcc.split(','),
          inputMessage: this.state.onSubmitInputMessage,
          recipient: this.state.studentEmails.split(','),
        }
      }, () => {
        console.log('callback from set state on click send students', this.state.message);
        this.generateEmail(this.state.message);
      });
      Swal.fire(
        'Good Job, email sent!'
      )
    } else {
      Swal.fire(
        'You forgot to fill something out!'
      )
    }
  }
  private onClickSendLevels = () => {
    if (this.state.onSubmitInputMessage.length !== 0 && this.state.subjectLine.length !== 0) {
      this.setState({
        message: {
          subjectLine: this.state.subjectLine,
          bcc: this.state.bcc.split(','),
          inputMessage: this.state.onSubmitInputMessage,
          reicipent: this.state.level,
        }
      }, () => {
        console.log('callback from set state on click send levels', this.state.message);
        this.generateEmail(this.state.message);
      });
      Swal.fire(
        'Good Job, email sent!'
      )
    } else {
      Swal.fire(
        'You forgot to fill something out!'
      )
    }
  }

  private onClickSendToAll = () => {
    if (this.state.onSubmitInputMessage.length !== 0 && this.state.subjectLine.length !== 0) {
      this.setState({
        message: {
          subjectLine: this.state.subjectLine,
          bcc: this.state.bcc.split(','),
          inputMessage: this.state.onSubmitInputMessage,
          reicipent: this.state.level,
        }
      }, () => {
        console.log('callback from set state on click send all', this.state.message);
        this.generateEmail(this.state.message);
      });
      Swal.fire(
        'Good Job, email sent!'
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
            <Button color='green' basic onClick={this.onClickPreviewSave}>Preview And Save</Button>
            <Header as='h4' dividing>SEND NEWSLETTER</Header>
            <TextField name='studentEmails'/>
            <BoolField name='sendToStudentsToo'></BoolField>
            <button disabled={!this.state.sendToStudentsToo} onClick={this.onClickSendStudentsToo}>Send To Admin</button>
            <NumField name='level'/>
            <BoolField name='sendToLevels'/>
            <button disabled={!this.state.sendToLevels} onClick={this.onClickSendLevels}>Send To Students</button>
            <BoolField name='sendToAll'/>
            <button disabled={!this.state.sendToAll} onClick={this.onClickSendToAll}>Send To All</button>
          </AutoForm>
        </Segment>
      </div>
    )
  }
}

export default withRouter(AdminAnalyticsNewsletterWidget);
