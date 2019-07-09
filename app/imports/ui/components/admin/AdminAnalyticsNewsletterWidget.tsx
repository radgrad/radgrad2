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
import { getRemainingRequirementsMethod } from "../../../api/analytic/RemainingRequirements.methods";
import { getProjectedICE } from '../../../api/ice/IceProcessor';
import { AcademicPlans } from "../../../api/degree-plan/AcademicPlanCollection";
import { Slugs } from "../../../api/slug/SlugCollection";
import { CourseInstances } from "../../../api/course/CourseInstanceCollection";
import { Courses } from "../../../api/course/CourseCollection";

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

const iceMap = {
  i: {
    name: 'Innovation', color: '#80ad27',
    low: 'You are lacking in Innovation! Consider adding some research opportunities or other' +
      ' innovation-related activities to strengthen this area.',
    med: 'You are showing growth in Innovation. Consider adding some research opportunities or other' +
      ' innovation-related activities to strengthen this area.',
    high: 'You are close to achieving 100 points in Innovation! Add a few more innovation-related opportunities' +
      ' to top this area off.',
  },
  c: {
    name: 'Competency', color: '#26407c',
    low: 'You are lacking in Competency. Go to your Degree Planner and flesh out your academic plan by adding' +
      ' more courses to strengthen this area.',
    med: 'You are showing some Competency in your degree plan. Go to your Degree Planner and flesh out your' +
      ' academic plan by adding more courses.',
    high: 'You are showing great Competency! Add a few more courses to get to 100 points.',
  },
  e: {
    name: 'Experience', color: '#952263',
    low: 'You are lacking in Experience! Add some profession-related opportunities to show' +
      ' that you are ready to work in a professional environment.',
    med: 'You have some professional development in your degree plan. To increase your Experience points' +
      ' and show that you are ready to work in a professional environment, add some profession-related' +
      ' opportunities.',
    high: 'You are showing a great amount of Experience in your degree plan! Add a few more' +
      ' profession-related opportunities to top this area off and reach 100 Experience points!',
  },
};

const levelMap = {
  1: 'You are currently level 1. To get to level 2, finish your first semester of ICS' +
    ' coursework and then go see your advisor to confirm the completion of your courses and pick up' +
    ' a new laptop sticker!',
  2: 'You are currently level 2. To get to the next level, complete your second semester of ICS' +
    ' coursework, though that alone may not be enough! Venture out and complete some opportunities, get them' +
    ' verified by your advisor, and then you may find yourself at the next level.',
  3: 'Now that you are well into your academic career, it\'s time to plan further' +
    ' ahead. Complete your degree plan by adding enough courses and opportunities to reach 100 ICE points. Finish' +
    ' a bit more coursework and get a few more verified opportunities, and you\'ll get to level 4! Don\'t forget' +
    ' to update your RadGrad profile too... That new sticker depends on it.',
  4: 'At level 4, you have not only shown great competency through your coursework, but you have also shown' +
    ' innovation and experience through your opportunities. Continue with your curriculum, focus on verifying even' +
    ' more opportunities, and help your peers out by leaving reviews for courses and opportunities' +
    ' that you have completed. By doing so, you may find yourself at a rare level.',
  5: 'You are a veteran in the ICS community. The finish line is in sight, at least for your undergraduate career.' +
    ' But don\'t slow down! Take part in more opportunities to really show that you are ready for a professional life' +
    ' after college, and don\'t forget to leave more reviews to help guide your peers to the next level. There is a' +
    ' possibility that at the end of all this, you will achieve the rarest RadGrad honor.',
  6: 'You have reached the level of ICS elites. At level 6, you have shown that there is little holding you back' +
    ' from a successful future in computer science, whether it\'s joining the workforce or entering Graduate School.' +
    ' Congratulations on your journey! If you have not already done so, pick up your new RadGrad sticker and show it' +
    ' off proudly!',
};

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
    const emailData = {
      to: message.recipients,
      from: 'Phillip Johnson <donotreply@mail.gun.radgrad.org>',
      replyTo: 'radgrad@hawaii.edu',
      templateData: {
        adminMessage: message.inputMessage,
      },
      filename: 'newsletter2.html'
    };
    _.map(message.recipients, (username) => {
      console.log('username: ',username);
      const informationForEmail = this.getInformationForEmail(username);
      console.log('get information for email', informationForEmail);
      emailData['subject'] = `Newsletter View For ${informationForEmail.studentInfo.firstName} ${informationForEmail.studentInfo.lastName}`;
      emailData.templateData['firstName'] = informationForEmail.studentInfo.firstName;
      emailData.templateData['lastName'] = informationForEmail.studentInfo.lastName;
      emailData.templateData['firstRec'] = informationForEmail.emailInfo.recommendationOne;
      emailData.templateData['secondRec'] = informationForEmail.emailInfo.recommendationTwo;
      emailData.templateData['thirdRec'] = informationForEmail.emailInfo.recommendationThree;
      sendEmailMethod.call(emailData, (error) => {
        if (error) {
          Swal.fire('Error sending email.');
          console.log('error', error);
        }
      });
    })
  }

  private getInformationForEmail = (username) => {
    // ToDo: need to fire swal if user not found
    console.log('users find profile from username', Users.findProfileFromUsername(username));

    /**
     *  I need to check if student.
     *  If it is I need:
     *  first & last name
     *  innovation points
     *  competency points
     *  experience points
     *  level
     *  academic plan
     *  missing requirements
     * */
    if (Users.findProfileFromUsername(username).role !== 'STUDENT') {
      const role = Users.findProfileFromUsername(username).role;
      console.log('get information for email role: ', role);
      // use role to find collection to search
      // search for user and return first and last name
    } else {
      const student = StudentProfiles.findDoc(username); //doc
      console.log('student should be doc', student);
      const recommendations = this.getRecommendations(student); //array
      console.log('recommendations: ', recommendations)
      const informationForEmail = {
        studentInfo: {
          username: student.username,
          firstName: student.firstName,
          lastName: student.lastName,
        },
        emailInfo: {
          recommendationOne: recommendations[0],
          recommendationTwo: recommendations[1],
          recommendationThree: recommendations[2]
        }
      }
      return informationForEmail;
    }
  }

  private getRecommendations = (student) => {
    const recommendations = [];
    const projectedICE = StudentProfiles.getProjectedICE(student.userID);
    recommendations.push(this.getRecommendationsICE(projectedICE));
    recommendations.push(this.getRecommendationsLevel(student));
    recommendations.push(this.getRecommendationsAcademicPlan(student));
    return recommendations;
  }

  private getRecommendationsICE = (projectedICE) => {
    if (projectedICE.i < 100 && projectedICE.c < 100 && projectedICE.e < 100) {
      const firstRec = {
        header: 'Finish Your Degree Plan',
        info: 'recommendations for Innovation, Competency and Experience'
      }
      return firstRec;
    } else {
      const complete = {
        header: 'You Have Completed Your Degree Plan'
      };
    }
  }

  private getRecommendationsInnovation = (projectedICEi) => {
  }

  private getRecommendationsCompetency = (projectedICEc) => {
  }

  private getRecommendationsExperience = (projectedICEe) => {
  }

  private getRecommendationsLevel = (student) => {
    return {
      header: 'Level Up and Upgrade Your RadGrad Sticker',
      info: `<img src="https://radgrad.ics.hawaii.edu/images/level-icons/radgrad-level-${student.level}-icon.png" width="100" height="100" style="float: left; margin: 0 10px;">`
        + `<p style="color: #6FBE44;"><strong>Current Level: ${student.level}</strong></p>` + `<p><em>Swing by your advisor's office or POST 307 to pick up a laptop sticker for your current level if you haven't already!</em></p>`
        + `<p>${levelMap[student.level]}</p>` + `<a style="color: #6FBE44; font-weight: bold" href="https://radgrad.ics.hawaii.edu/">Take me to RadGrad!</a>`
    }
  }

  private getRecommendationsAcademicPlan = (student) => {
    console.log('get recommendations academic plans student: ', student);
    const studentAcademicPlanDoc = AcademicPlans.findDoc(student.academicPlanID);
    const academicPlanSlug = Slugs.getNameFromID(studentAcademicPlanDoc.slugID);
    const remainingReqs = this.getRemainingRequirements(student, studentAcademicPlanDoc)
    console.log('student\'s academic plan doc', studentAcademicPlanDoc);
    //console.log('student\'s remaining reqs',remainingReqs);

    const html = {
      header: 'Complete Your Academic Plan',
      info: `<p>Your Current Academic Plan: <a style ="color: #6FBE44; font-weight: bold" href = "https://radgrad.ics.hawaii.edu/student/${student.username}
       /explorer/plans/${academicPlanSlug}">${studentAcademicPlanDoc.name}</a></p>`
    }
    if (this.isAcademicPlanCompleted(remainingReqs) === false) {
      html.info += '<p>Your degree planner shows that you do not' +
        ' have all required coursework planned out yet. Head over to your' +
        ' <a style="color: #6FBE44; font-weight: bold;"' +
        ` href="https://radgrad.ics.hawaii.edu/student/${student.username}/degree-planner">RadGrad degree planner</a>` +
        ' to complete your academic plan, or click on your plan above to find out more information.' +
        ' Provided below is a list of required coursework that you are currently missing.' +
        ' Make sure to double-check the requirements with your advisor!</p>';
      /*if (remainingReqs.length > 0) {
        html.info += '<p style="text-decoration: underline;">Missing Requirements: </p>';
        html.info += '<ul>';
        _.each(remainingReqs, function (req) {
          const requirement = (req.toString().toUpperCase()).replace(/,/g, ' or ').replace(/_/g, ' ');
          html.info += `<li style="color: red;">${requirement}</li>`;
        });
        html.info += '</ul>';
      }*/
    } else {
      html.info = '<p>You have completed all your academic requirements</p>'
    }
    return html;
  }

  private getRemainingRequirements = (student, studentAcademicPlanDoc) => {
    getRemainingRequirementsMethod.call({ student, studentAcademicPlanDoc }, (error) => {
      if (error) {
        Swal.fire('Error sending email.');
        console.log('error', error);
      }
    })
    //const studentCompletedCourses = CourseInstances.find({'verified': true, 'studentID': student.username})
    // cannot access CourseInstances because client not subscribed
    // write meteor method to do this and call on server side
    // refer to Email.ts, Email.methods.ts
    //console.log('student completed courses',studentCompletedCourses);

    /*  const studentInPlanCourses = []
      _.map(studentAcademicPlanDoc.courseList, (courseID) => {
        studentInPlanCourses.push(Courses.findDoc(courseID));
      });
      console.log(studentInPlanCourses);
      */
    const remainingRequirements = ['remaining requirements'];
    return remainingRequirements;
  }

  private isAcademicPlanCompleted = (remainingReqs) => {
    if (remainingReqs.length === 0) {
      return true;
    } else {
      return false;
    }
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
