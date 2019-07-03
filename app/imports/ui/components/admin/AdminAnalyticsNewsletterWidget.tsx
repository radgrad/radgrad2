import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Header, Grid, Form, Button, Label, Checkbox } from "semantic-ui-react";
import AutoForm from 'uniforms-semantic/AutoForm';
import LongTextField from 'uniforms-semantic/LongTextField';
import TextField from 'uniforms-semantic/TextField';
import BoolField from 'uniforms-semantic/BoolField';
import SelectField from 'uniforms-semantic/SelectField';
import NumField from 'uniforms-semantic/SelectField';
import SimpleSchema from 'simpl-schema';
import AdminAnalyticsNewsletterMessagePreviewWidget from "./AdminAnalyticsNewsletterMessagePreviewWidget";
import Swal from "sweetalert2";
import { StudentProfiles } from "../../../api/user/StudentProfileCollection";
import { Users } from "../../../api/user/UserCollection";
import { Meteor } from 'meteor/meteor';
import * as _ from 'lodash';
import { sendEmailMethod } from "../../../api/analytic/Email.methods";
import { getProjectedICE } from '../../../api/ice/IceProcessor';

// app/imports/typings/meteor-meteor.d.ts
const schema = new SimpleSchema({
  inputMessage: String,
  bcc: { type: String, optional: true },
  subjectLine: String,
  studentEmails: { type: String, optional: true, label: 'Student Emails' },
  level: {
    type: SimpleSchema.Integer,
    allowedValues: [1, 2, 3, 4, 5, 6],
    optional: true,
    label: 'Generate and send newsletters to students of the specified level',
  },
  sendToStudentsToo: { type: Boolean, optional: true },
  sendToLevels: { type: Boolean, optional: true, label: 'Check to confirm send' },
  sendToAll: { type: Boolean, optional: true, label: 'Check to confirm send' },
})

interface IAdminAnalyticsNewsletterWidget {
  userID: string
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
  private handleChange = (name, value) => {
    let intermediateState = {};
    intermediateState[name] = value;
    this.setState(intermediateState, () => {
    });
  }

  private onClickPreviewSave = () => {
    this.setState({ onSubmitInputMessage: this.state.inputMessage });
  }


  private onClickSendStudentsToo = () => {
    if (this.state.onSubmitInputMessage.length !== 0 && this.state.subjectLine.length !== 0) {
      this.setState({
        message: {
          subjectLine: this.state.subjectLine,
          bcc: this.state.bcc.split(','),
          inputMessage: this.state.onSubmitInputMessage,
          recipients: this.state.studentEmails.split(','), // add admin too
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
    if (this.state.onSubmitInputMessage.length !== 0 && this.state.subjectLine.length !== 0 && this.state.level !== 0) {
      this.setState({
        message: {
          subjectLine: this.state.subjectLine,
          bcc: this.state.bcc.split(','),
          inputMessage: this.state.onSubmitInputMessage,
          recipients: this.getStudentEmailsByLevel(this.state.level),
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
          recipients: this.getAllUsersEmails(),
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

    //console.log('this is the message: ',message)
    const emailData = {
      to: message.recipients,
      from: 'Phillip Johnson <donotreply@mail.gun.radgrad.org>',
      replyTo: 'radgrad@hawaii.edu',
      subject: '',
      templateData: {
        adminMessage: message.inputMessage,
        firstName: '',
      },
      filename: 'newsletter2.html'
    };
    _.map(message.recipients, (student) => {
      const studentProfile = StudentProfiles.findDoc(student);
      const recommendations = this.getRecommendations(studentProfile.username);
      emailData.templateData.firstName = studentProfile.firstName;
      emailData.subject = `Newsletter View For ${studentProfile.firstName} ${studentProfile.lastName}`;
      emailData.templateData['firstRec'] = recommendations[0];
      emailData.templateData['secondRec'] = recommendations[1];
      emailData.templateData['thirdRec'] = recommendations[2];
      console.log(emailData);
      sendEmailMethod.call(emailData, (error) => {
        if (error) {
          Swal.fire('Error sending email.');
          console.log('error', error);
        }
      });
    })
  }

  private getStudentEmailsByLevel = (level) => {
    const emailaddresses = [];
    console.log(level);
    const studentLevel = parseInt(level, 10);
    const students = StudentProfiles.findNonRetired({ level: studentLevel }); // array of objects
    console.log(students);
    _.map(students, (profile, index) => {
      emailaddresses.push(profile.username);
    })
    return emailaddresses;
  }

  private getAllUsersEmails = () => {
    const allUsers = Meteor.users.find().fetch();
    const emailAddresses = [];
    _.map(allUsers, (profile, index) => {
      emailAddresses.push(profile.username);
    })
    return emailAddresses;
  }

  private getRecommendations = (student) => {
    const recommendations = [];
    const projectedICE = StudentProfiles.getProjectedICE(student);
    console.log(projectedICE);
    if (projectedICE.i < 100) {
      recommendations.push(this.getRecommendationsInnovation(projectedICE.i));
    } else {
      console.log('Yay, you\'ve completed the innovation points!')
    }
    if (projectedICE.c < 100) {
      recommendations.push(this.getRecommendationsCompetency(projectedICE.c));
    } else {
      console.log('Yay, you\'ve completed the comptency points!');
    }
    if(projectedICE.e <100){
      recommendations.push(this.getRecommendationsExperience(projectedICE.e));
    } else {
      console.log('Yay, you\'ve completed the experience points!');
    }
    return recommendations;
  }

  private getRecommendationsInnovation = (projectedICEi) => {
    const innovationRec = {
      header: `here are some recommendations because you need ${100 - projectedICEi} more Innovation points`,
      info: `information on innovation opportunities`
    };
    return innovationRec;
  }

  private getRecommendationsCompetency = (projectedICEc) => {
    const competencyRec = {
      header: `here are some recommendations because you need ${100 - projectedICEc} more Compentency points`,
      info: `information on competency opportunities`
    };
    return competencyRec;
  }

  private getRecommendationsExperience = (projectedICEe) => {
    const experienceRec = {
      header: `here are some recommendations because you need ${100 - projectedICEe} more Experience points`,
      info: `information on experience opportunities`
    };
    return experienceRec;

  }

  public render() {
    return (
      <div>
        {/*Auto Forms*/}
        <Segment padded={true}>
          <Header dividing as='h4'>NEWSLETTER OPTIONS</Header>
          <AutoForm schema={schema} onChange={this.handleChange}>
            <TextField name='subjectLine'/>
            <TextField name='bcc'/>
            <Form.Group widths='equal'>
              <LongTextField name='inputMessage'/>
              <AdminAnalyticsNewsletterMessagePreviewWidget message={this.state.onSubmitInputMessage}/>
            </Form.Group>
            <Button color='green' basic onClick={this.onClickPreviewSave}>Preview And Save</Button>
            <Header as='h4' dividing>SEND NEWSLETTER</Header>
            <TextField name='studentEmails'/>
            <BoolField name='sendToStudentsToo'></BoolField>
            <Button basic color='green' onClick={this.onClickSendStudentsToo}>Send To Admin</Button>

            <NumField name='level' placeholder='level'/>
            <BoolField name='sendToLevels'/>
            <button className='ui basic green button' disabled={!this.state.sendToLevels}
                    onClick={this.onClickSendLevels}>Send To Students
            </button>
            <Form.Field label='Generate To Send To All Users'/>
            <BoolField name='sendToAll'/>
            <button className='ui basic green button' disabled={!this.state.sendToAll}
                    onClick={this.onClickSendToAll}>Send To All
            </button>
          </AutoForm>
        </Segment>
      </div>
    )
  }
}

export default withRouter(AdminAnalyticsNewsletterWidget);
