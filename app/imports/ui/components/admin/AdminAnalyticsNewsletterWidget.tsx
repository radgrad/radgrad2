import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Header, Grid, Form, Button, Label, Checkbox } from "semantic-ui-react";
import AutoForm from 'uniforms-semantic/AutoForm';
import LongTextField from 'uniforms-semantic/LongTextField';
import TextField from 'uniforms-semantic/TextField';
import BoolField from 'uniforms-semantic/BoolField';
import NumField from 'uniforms-semantic/NumField';
import SimpleSchema from 'simpl-schema';

const schema = new SimpleSchema({
  inputMessage: String,
  bcc: { type: String, optional: true },
  subjectLine: String,
  studentEmails: { type: String, optional: true },
  level: { type: SimpleSchema.Integer, allowedValues: [1, 2, 3, 4, 5, 6] },
  sendToStudents: { type: Boolean, optional: true },
  sendToLevels: { type: Boolean, optional: true },
  sendToAll: { type: Boolean, optional: true }
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

const options = [
  { key: '1', text: 'Level 1', value: '1' },
  { key: '2', text: 'Level 2', value: '2' },
  { key: '3', text: 'Level 3', value: '3' },
  { key: '4', text: 'Level 4', value: '4' },
  { key: '5', text: 'Level 5', value: '5' },
  { key: '6', text: 'Level 6', value: '6' },
]


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

  // change to work w/ AutoForm
  private handleChangeText = (e, { name, value }) => {
    let intermediateState = {};
    intermediateState[name] = value;
    this.setState(intermediateState);
    console.log(this.state);
  }

  private onClickPreviewSave = () => {
    this.setState({ onSubmitInputMessage: this.state.inputMessage });
    this.setState({
      message: {
        subjectLine: this.state.subjectLine,
        bcc: this.state.bcc,
        inputMessage: this.state.onSubmitInputMessage
      }
    });
  }

  private handleChangeCheckBox = (event, something) => {
    console.log(event, something);
  }

  private onClickSendToStudentsToo = () => {
    // see if box is checked
  }


  public render() {
    return (
      <div>
        <Segment>
          <Header dividing as='h4'>NEWSLETTER OPTIONS</Header>
          <AutoForm schema={schema}>

            <Form.Group>
              <LongTextField name='inputMessage'/>
              <Form.Field label='Message Preview'>
                <div className='markdown'/>
              </Form.Field>
            </Form.Group>


            <Button basic color='green' onClick={this.onClickPreviewSave}>Preview And Save</Button>
            <TextField name='bcc'/>
            <TextField name='subjectLine'/>

            <Header as='h4' dividing>SEND NEWSLETTER</Header>
            <TextField name='studentEmails'/>
            <BoolField name='sendToStudents'></BoolField>
            <Button basic color='green'>Send To Admin</Button>


            <NumField name='level'/>
            <BoolField name='sendToLevels'/>
            <Button basic color='green'>Send To Students</Button>

            <BoolField name='sendToAll'/>
            <Button basic color='green'>Send To All</Button>
           
          </AutoForm>
          {/* <div>
            <Header as='h4' dividing>NEWSLETTER OPTIONS</Header>
            <Grid padded>
              <Grid.Row>
                <Grid.Column width={8}>
                  <Form>
                    <Form.TextArea required label='Input admin message in markdown format'
                                   input={this.state.inputMessage} onChange={this.handleChangeText}
                                   name='inputMessage'/>
                    <Button type='submit' color='green' basic onClick={this.onClickPreviewSave}>Preview And
                      Save</Button>
                  </Form>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Form>
                    <Form.Field label='Message Preview'/>
                    <p>Aloha Student!</p>
                    <div className='markdown'>
                      {this.state.onSubmitInputMessage}
                    </div>
                    <p>- The RadGrad Team</p>
                  </Form>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Form>
                    <Form.Input label='BCC recipients' placeholder='Input comma separated list of bcc recipients'
                                onChange={this.handleChangeText} name='bcc'/>
                    <Form.Input label='Subject line' placeholder='Input email subject line'
                                onChange={this.handleChangeText}
                                name='subjectLine' required/>
                  </Form>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
          <div>
            <Header as='h4' dividing>SEND NEWSLETTER</Header>
            <Grid padded>
              <Grid.Row>
                <Grid.Column>
                  <Form>
                    <Form.Input label='Generate student newsletters and send to admin'
                                placeholder='Input student emails seperated by commas' onChange={this.handleChangeText}
                                name='studentEmails'/>
                    <Form.Checkbox label='Send to students too' onChange={this.handleChangeCheckBox}
                                   name='sendToStudentsToo'/>
                    <Button color='green' basic onClick={this.onClickSendToStudentsToo}>Send to Admin</Button>
                  </Form>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Form>
                    <Form.Field>
                      <Form.Select label='Generate and send newsletters to students of the specified level'
                                   options={options}
                                   placeholder='Level'/>
                    </Form.Field>
                    <Form.Field>
                      <Form.Checkbox label='Check to confirm send' onChange={this.handleChangeText}
                                     name='confirmSendLevel'/>
                    </Form.Field>
                    <Button color='green' basic>Send To Students</Button>
                  </Form>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Form>
                    <Form.Field label='Generate and send newsletters to ALL students'/>
                    <Form.Checkbox label='Check to confirm send' onChange={this.handleChangeText}
                                   name='confirmSendAll'/>
                    <Button color='green' basic>Send To All Students</Button>
                  </Form>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>*/}
        </Segment>
      </div>
    )
  }
}

export default withRouter(AdminAnalyticsNewsletterWidget);
