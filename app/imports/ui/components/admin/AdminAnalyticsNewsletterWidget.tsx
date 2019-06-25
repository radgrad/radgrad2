import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Header, Grid, Form, Button, Label, Checkbox } from "semantic-ui-react";

interface IAdminAnalyticsNewsletterWidget {

}

interface IAdminAnalyticsNewsletterWidgetState {
  inputMessage: string,
  bcc: string,
  subjectLine: string,
  studentEmails: string,
  sendToStudentsToo: boolean,
  level: number,
  confirmSendLevel: boolean,
  confirmSendAll: boolean,
}

const options = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
  { key: 'o', text: 'Other', value: 'other' },
]


class AdminAnalyticsNewsletterWidget extends React.Component<IAdminAnalyticsNewsletterWidget, IAdminAnalyticsNewsletterWidgetState> {
  constructor(props) {
    super(props)
    this.state = {
      inputMessage: '',
      bcc: '',
      subjectLine: '',
      studentEmails: '',
      sendToStudentsToo: false,
      level: 0,
      confirmSendLevel: false,
      confirmSendAll: false
    }
  }

  private handleChange = (e, { name, value }) => {
    console.log(e, name, value);
    this.setState({ [name]: value });
    console.log(this.state);
  }

  public render() {
    return (
      <div>
        <Segment>
          <Header as='h4' dividing>NEWSLETTER OPTIONS</Header>
          <Grid padded>
            <Grid.Row>
              <Grid.Column width={8}>
                <Form>
                  <Form.TextArea required label='Input admin message in markdown format'
                                 input={this.state.inputMessage} onChange={this.handleChange} name='inputMessage'/>
                  <Button color='green' basic>Preview And Save</Button>
                </Form>
              </Grid.Column>
              <Grid.Column width={8}>
                <Form>
                  <Form.Field label='Message Preview'/>
                  <p>Aloha Student!</p>
                  <div className='markdown'>

                  </div>
                  <p>- The RadGrad Team</p>
                </Form>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form>
                  <Form.Input label='BCC recipients' placeholder='Input comma separated list of bcc recipients'
                              onChange={this.handleChange} name='bcc'/>
                  <Form.Input label='Subject line' placeholder='Input email subject line' onChange={this.handleChange}
                              name='subjectLine' required/>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Header as='h4' dividing>SEND NEWSLETTER</Header>
          <Grid padded>
            <Grid.Row>
                <Form>
                  <Form.Input label='Generate student newsletters and send to admin'
                              placeholder='Input student emails seperated by commas' onChange={this.handleChange}
                              name='studentEmails'/>
                  <Checkbox label='Send to students too'/>
                  <Button color='green' basic>Send to Admin</Button>
                </Form>
            </Grid.Row>
            <Grid.Row>
              <Form>
                <Form.Field control={onselect} label='Generate and send newsletters to students of the specified level' options={options} placeholder='Level'/>
              </Form>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }
}

export default withRouter(AdminAnalyticsNewsletterWidget);
