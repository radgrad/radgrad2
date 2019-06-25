import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Header, Grid, Form, Button, Label } from "semantic-ui-react";

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

  private handleChange = (e, {name, value}) => {
    console.log(name, value);
    this.setState({ [name]: value });
    console.log(this.state);
  }

  public render() {
    console.log(this.state);
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
                <Form.Input label='BCC recipients' placeholder ='Input comma separated list of bcc recipients' onChange={this.handleChange} name='bcc'/>
                <Form.Input label='Subject line' placeholder='Input email subject line' onChange={this.handleChange} name='subjectLine' required/>
                </Form>
              </Grid.Column>
            </Grid.Row>

          </Grid>
        </Segment>
      </div>
    )
  }
}

export default withRouter(AdminAnalyticsNewsletterWidget);
