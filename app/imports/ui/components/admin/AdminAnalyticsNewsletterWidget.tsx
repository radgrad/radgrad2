import React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Header, Form, Button } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, BoolField, NumField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import AdminAnalyticsNewsletterMessagePreviewWidget from './AdminAnalyticsNewsletterMessagePreviewWidget';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { sendEmailMethod } from '../../../api/analytic/Email.methods';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';

// TODO: bug hunting
// admin should be recieving copy of newsletter 09/16/19
// currenty, admin recieves copy, but without student's information
// should probably try to handle if the "send to student's too" checkbox is not checked
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
});
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
    super(props);
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
    };
  }

  /** Auto Forms */
    // check on this https://stackoverflow.com/questions/38558200/react-setstate-not-updating-immediately
  private handleChange = (name, value) => {
    const intermediateState = {};
    intermediateState[name] = value;
    this.setState(intermediateState, () => {
    });
  }

  private onClickPreviewSave = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    this.setState({ onSubmitInputMessage: this.state.inputMessage });
  }

  private onClickSendStudentsToo = () => {
    const trimmedEmails = [];
    const studentEmails = this.state.studentEmails.split(',');
    const adminEmail = RadGradProperties.getAdminEmail();
    if (this.state.sendToStudentsToo === false) {
      this.setState({
        message: {
          // eslint-disable-next-line react/no-access-state-in-setstate
          subjectLine: this.state.subjectLine,
          // eslint-disable-next-line react/no-access-state-in-setstate
          bcc: `${this.state.bcc.split(',')}${adminEmail}`,
          // eslint-disable-next-line react/no-access-state-in-setstate
          inputMessage: this.state.onSubmitInputMessage,
          recipients: [/* 'radgrad@hawaii.edu' */],
        },
      }, () => {
        this.generateEmail(this.state.message);
        Swal.fire('Email sent to admin');
      });
    } else {
      _.map(studentEmails, (emails) => {
        emails.toString();
        trimmedEmails.push(emails.trim());
      });
      // send copy to admin
      // trimmedEmails.push('radgrad@hawaii.edu');
      _.map(trimmedEmails, (trimmedEmail) => {
        if (this.state.onSubmitInputMessage.length !== 0 && this.state.subjectLine.length !== 0) {
          if (Users.isDefined(trimmedEmail) === true) {
            const trimmedRecipients = [];
            trimmedRecipients.push(trimmedEmail);
            this.setState({
              message: {
                // eslint-disable-next-line react/no-access-state-in-setstate
                subjectLine: this.state.subjectLine,
                // eslint-disable-next-line react/no-access-state-in-setstate
                bcc: this.state.bcc.split(',') /* + 'radgrad@hawaii.edu' */,
                // eslint-disable-next-line react/no-access-state-in-setstate
                inputMessage: this.state.onSubmitInputMessage,
                recipients: trimmedRecipients,
              },
            }, () => {
              this.generateEmail(this.state.message);
            });
            Swal.fire(
              'Email sent to Admin and students',
            );
          } else {
            Swal.fire(
              `User: ${trimmedEmail} is NOT in the Student Profile Collection`,
            );
          }
        } else {
          Swal.fire(
            'You forgot to fill something out...',
          );
        }
      });
    }

  }

  private onClickSendLevels = () => {
    if (this.state.onSubmitInputMessage.length !== 0 && this.state.subjectLine.length !== 0 && this.state.level !== 0) {
      this.setState({
        message: {
          // eslint-disable-next-line react/no-access-state-in-setstate
          subjectLine: this.state.subjectLine,
          // eslint-disable-next-line react/no-access-state-in-setstate
          bcc: this.state.bcc.split(','),
          // eslint-disable-next-line react/no-access-state-in-setstate
          inputMessage: this.state.onSubmitInputMessage,
          // eslint-disable-next-line react/no-access-state-in-setstate
          recipients: this.getStudentEmailsByLevel(this.state.level),
        },
      }, () => {
        this.generateEmail(this.state.message);
      });
      Swal.fire(
        'Good Job, email sent!',
      );
    } else {
      Swal.fire(
        'You forgot to fill something out!',
      );
    }
  }

  private onClickSendToAll = () => {
    if (this.state.onSubmitInputMessage.length !== 0 && this.state.subjectLine.length !== 0) {
      this.setState({
        message: {
          // eslint-disable-next-line react/no-access-state-in-setstate
          subjectLine: this.state.subjectLine,
          // eslint-disable-next-line react/no-access-state-in-setstate
          bcc: this.state.bcc.split(','),
          // eslint-disable-next-line react/no-access-state-in-setstate
          inputMessage: this.state.onSubmitInputMessage,
          recipients: this.getAllUsersEmails(),
        },
      }, () => {
        this.generateEmail(this.state.message);
      });
      Swal.fire(
        'Good Job, email sent!',
      );
    } else {
      Swal.fire(
        'You forgot to fill something out!',
      );
    }
  }

  private generateEmail = (message) => {
    const adminEmail = RadGradProperties.getAdminEmail();
    const newsletterFrom = RadGradProperties.getNewsletterFrom();
    const emailData = {
      to: message.recipients,
      from: newsletterFrom,
      subject: '',
      replyTo: adminEmail,
      templateData: {
        adminMessage: message.inputMessage,
        firstName: '',
        lastName: '',
        firstRec: '',
        secondRec: '',
        thirdRec: '',
      },
      filename: 'newsletter2.html',
    };
    _.map(message.recipients, (username) => {
      const informationForEmail = this.getInformationForEmail(username);
      emailData.subject = `Newsletter View For ${informationForEmail.recipientInfo.firstName} ${informationForEmail.recipientInfo.lastName}`;
      emailData.templateData.firstName = informationForEmail.recipientInfo.firstName;
      emailData.templateData.lastName = informationForEmail.recipientInfo.lastName;
      emailData.templateData.firstRec = informationForEmail.emailInfo.recommendationOne;
      emailData.templateData.secondRec = informationForEmail.emailInfo.recommendationTwo;
      emailData.templateData.thirdRec = informationForEmail.emailInfo.recommendationThree;
      sendEmailMethod.call(emailData, (error) => {
        if (error) {
          Swal.fire('Error sending email.');
        }
      });
    });
  }

  private getInformationForEmail = (username) => {
    const informationForEmail = {
      recipientInfo: {
        username: [],
        firstName: '',
        lastName: '',
      },
      emailInfo: {
        recommendationOne: '',
        recommendationTwo: '',
        recommendationThree: '',
      },
    };
    // send to admin
    // if (username === 'radgrad@hawaii.edu') {
    //   informationForEmail.recipientInfo.username = username;
    //   informationForEmail.recipientInfo.firstName = 'Admin';
    // } else {
      if (Users.findProfileFromUsername(username).role !== 'STUDENT') {
        const role = Users.findProfileFromUsername(username).role;
        switch (role) {
          case 'FACULTY':
            // eslint-disable-next-line no-case-declarations
            const faculty = FacultyProfiles.findDoc(username);
            informationForEmail.recipientInfo.username = faculty.username;
            informationForEmail.recipientInfo.firstName = faculty.firstName;
            informationForEmail.recipientInfo.lastName = faculty.lastName;
            break;
          case 'ADVISOR':
            // eslint-disable-next-line no-case-declarations
            const advisor = AdvisorProfiles.findDoc(username);
            informationForEmail.recipientInfo.username = advisor.username;
            informationForEmail.recipientInfo.firstName = advisor.firstName;
            informationForEmail.recipientInfo.lastName = advisor.lastName;
            break;
          default:
            break;
        }
        // use role to find collection to search
        // search for user and return first and last name
        // put in conditional if user is not found in Users Collections
      } else {
        const student = StudentProfiles.findDoc(username); // doc
        const recommendations = this.getRecommendations(student); // array
        informationForEmail.recipientInfo.username = student.username;
        informationForEmail.recipientInfo.firstName = student.firstName;
        informationForEmail.recipientInfo.lastName = student.lastName;
        informationForEmail.emailInfo.recommendationOne = recommendations[0];
        informationForEmail.emailInfo.recommendationTwo = recommendations[1];
        informationForEmail.emailInfo.recommendationThree = recommendations[2];
      }
    // }
    return informationForEmail;
  }

  private getRecommendations = (student) => {
    const recommendations = [];
    recommendations.push(this.getRecommendationsICE(student));
    recommendations.push(this.getRecommendationsLevel(student));
    recommendations.push(this.getRecommendationsAcademicPlan(student));
    return recommendations;
  }

  private getRecommendationsICE = (student) => {
    const projectedICE = StudentProfiles.getProjectedICE(student.userID);
    if (projectedICE.i < 100 && projectedICE.c < 100 && projectedICE.e < 100) {
      const iCERec = {
        header: 'Finish Your Degree Plan',
        info: '<p>To achieve a complete degree plan, obtain 100 points in each ICE component!</p>',
      };
      _.each(projectedICE, (value, component) => {
        let iceLevel = '';
        if (value < 30) {
          iceLevel = '<span style="color: red;"><strong>NEEDS WORK</strong></span>';
        } else if (value < 60) {
          iceLevel = '<span style="color: orange;"><strong>NEEDS WORK</strong></span>';
        } else {
          iceLevel = '<span style="color: green;"><strong>GOOD</strong></span>';
        }
        iCERec.info += `<p><span style="color: ${iceMap[component].color}">${iceMap[component].name} (${value} points)</span>
        : ${iceLevel}</p>`;
        iCERec.info += `<ul><li>${this.iceRecHelper(student, value, component)}</li></ul>`;
      });
      return iCERec;
    }
    const complete = {
      header: 'You Have Completed Your Degree Plan',
    };
    return complete;
  }
  private iceRecHelper = (student, value, component) => {
    let html = '';
    if (value >= 100) {
      html += `Congratulations! You have achieved 100 ${iceMap[component].name} points!`;
      return html;
    } if (value < 30) {
      html += iceMap[component].low;
    } else if (value < 60) {
      html += iceMap[component].med;
    } else {
      html += iceMap[component].high;
    }
    const studentInterests = Users.getInterestIDs(student.userID);
    if (component === 'c') {
      if (studentInterests.length === 0) {
        html += ' <em><a href="https://radgrad.ics.hawaii.edu">' +
          ' Add some interests so we can provide course recommendations!</a></em>';
        return html;
      }
      const relevantCourses = _.filter(Courses.findNonRetired(), function (course) {
        if (_.some(course.interestIDs, interest => _.includes(studentInterests, interest))) {
          return true;
        }
        return false;
      });
      const currentCourses = _.map(CourseInstances.find({ studentID: student.userID }).fetch(), 'courseID');
      const recommendedCourses = _.filter(relevantCourses, course => !_.includes(currentCourses, course._id));
      if (recommendedCourses.length === 0) {
        html += '<em><a href="https://radgrad.ics.hawaii.edu">' +
          ' Add more interests so we can provide course recommendations!</a></em>';
        return html;
      }
      const recCourse = recommendedCourses[0];
      html += ' Check out';
      html += '<a style="color: #6FBE44; font-weight: bold;"' +
        ` href="https://radgrad.ics.hawaii.edu/student/${student.username}` +
        `/explorer/courses/${Courses.findSlugByID(recCourse._id)}"> ${recCourse.shortName}</a>`;
    } else {
      if (studentInterests.length === 0) {
        html += ' <em><a href="https://radgrad.ics.hawaii.edu">' +
          ' Add some Interests to your profile so we can provide opportunity recommendations!</a></em>';
        return html;
      }
      const opps = _.filter(Opportunities.findNonRetired(), function (opp) {
        return opp.ice[component] > 0;
      });
      const relevantOpps = _.filter(opps, function (opp) {
        if (_.some(opp.interestIDs, interest => _.includes(studentInterests, interest))) {
          return true;
        }
        return false;
      });
      if (relevantOpps.length === 0) {
        return ' <em><a href="https://radgrad.ics.hawaii.edu">' +
          ' Add more Interests to your profile so we can provide opportunity recommendations!</a></em>';
      }
      const currentOpps = _.map(OpportunityInstances.find({ studentID: student.userID }).fetch(), 'opportunityID');
      const recommendedOpps = _.filter(relevantOpps, opp => !_.includes(currentOpps, opp._id));
      let recOpp;
      if (recommendedOpps.length === 0) {
        recOpp = relevantOpps[0];
      } else {
        recOpp = recommendedOpps[0];
      }
      html += ' Check out';
      html += '<a style="color: #6FBE44; font-weight: bold;"' +
        ` href="https://radgrad.ics.hawaii.edu/student/${student.username}` +
        `/explorer/opportunities/${Opportunities.findSlugByID(recOpp._id)}"> ${recOpp.name}</a>`;
    }
    return html;
  }

  private getRecommendationsLevel = (student) => ({
    header: 'Level Up and Upgrade Your RadGrad Sticker',
    info: `<img alt="radgrad icon" src="https://radgrad.ics.hawaii.edu/images/level-icons/radgrad-level-${student.level}-icon.png" width="100" height="100" style="float: left; margin: 0 10px;"/> <p style="color: #6FBE44;"><strong>Current Level: ${student.level}</strong></p> <p><em>Swing by your advisor's office or POST 307 to pick up a laptop sticker for your current level if you haven't already!</em></p> <p>${levelMap[student.level]}</p><a style="color: #6FBE44; font-weight: bold" href="https://radgrad.ics.hawaii.edu/">Take me to RadGrad!</a>`,
  })

  private getRecommendationsAcademicPlan = (student) => {
    const studentAcademicPlanDoc = AcademicPlans.findDoc(student.academicPlanID);
    const academicPlanSlug = Slugs.getNameFromID(studentAcademicPlanDoc.slugID);
    const remainingReqs = this.getRemainingRequirements(student, studentAcademicPlanDoc);

    const html = {
      header: 'Complete Your Academic Plan',
      info: `<p>Your Current Academic Plan: <a style ="color: #6FBE44; font-weight: bold" href = "https://radgrad.ics.hawaii.edu/student/${student.username}
       /explorer/plans/${academicPlanSlug}">${studentAcademicPlanDoc.name}</a></p>`,
    };
    if (this.isAcademicPlanCompleted(student) === false) {
      html.info += '<p>Your degree planner shows that you do not' +
        ' have all required coursework planned out yet. Head over to your' +
        ' <a style="color: #6FBE44; font-weight: bold;"' +
        ` href="https://radgrad.ics.hawaii.edu/student/${student.username}/degree-planner">RadGrad degree planner</a>` +
        ' to complete your academic plan, or click on your plan above to find out more information.' +
        ' Provided below is a list of required coursework that you are currently missing.' +
        ' Make sure to double-check the requirements with your advisor!</p>';
      html.info += '<p style="text-decoration: underline;">Missing Requirements: </p>';
      html.info += '<ul>';
      _.each(remainingReqs, function (req) {
        const requirement = (req.toString().toUpperCase()).replace(/,/g, ' or ').replace(/_/g, ' ');
        html.info += `<li style="color: red;">${requirement}</li>`;
      });
      html.info += '</ul>';
    } else {
      html.info = '<p>You have completed all your academic requirements</p>';
    }
    return html;
  }

  private
  getRemainingRequirements = (student, studentAcademicPlanDoc) => {

    const studentCompletedCourses = CourseInstances.find({ verified: true, studentID: student.userID }).fetch();
    const inPlanCourseSlugs400 = [];
    const inPlanCourseSlugs300opt = [];
    const inPlanCourseSlugs = [];
    _.map(studentAcademicPlanDoc.courseList, (course) => {
      if (_.includes(course, '-') && _.includes(course, '_4')) {
        inPlanCourseSlugs400.push(course.substring(0, course.indexOf('-')));
      } else if (_.includes(course, ',')) {
        inPlanCourseSlugs300opt.push([course.substring(0, course.indexOf(',')), course.substring(course.indexOf(',') + 1, course.indexOf('-'))]);
      } else if (_.includes(course, '-')) {
        inPlanCourseSlugs.push(course.substring(0, course.indexOf('-')));
      }
    });
    const studentCompletedCourseSlugs = [];
    const studentCompletedCourseSlugs300op = [];
    const studentCompletedCourseSlugs400 = [];
    _.map(studentCompletedCourses, (course) => {
      const slugName = CourseInstances.getCourseSlug(course._id);
      if (_.includes(slugName, '_4')) {
        studentCompletedCourseSlugs400.push(slugName);
      } else if (_.includes(slugName, '312' || '331')) {
        studentCompletedCourseSlugs300op.push([slugName]);
      } else if (_.includes(slugName, '313' || '361')) {
        studentCompletedCourseSlugs300op.push([slugName]);
      } else {
        studentCompletedCourseSlugs.push(slugName);
      }
    });

    _.each(studentCompletedCourseSlugs400, () => {
      inPlanCourseSlugs400.pop();
    });

    const needsWork = _.difference(inPlanCourseSlugs, studentCompletedCourseSlugs);
    if ((_.difference(inPlanCourseSlugs300opt[0], studentCompletedCourseSlugs300op[0])).length === 2 && (_.difference(inPlanCourseSlugs300opt[1], studentCompletedCourseSlugs300op[1])).length === 2) {
      // return "ics_312, ics_331"
      const missingRequirements = _.concat(needsWork, `${inPlanCourseSlugs300opt[0][0]},${inPlanCourseSlugs300opt[0][1]}`, `${inPlanCourseSlugs300opt[1][0]},${inPlanCourseSlugs300opt[1][1]}`, inPlanCourseSlugs400);
      return missingRequirements;
    } if (((_.difference(inPlanCourseSlugs300opt[0], studentCompletedCourseSlugs300op[0])).length === 2)) {
      const missingRequirements = _.concat(needsWork, `${inPlanCourseSlugs300opt[0][0]},${inPlanCourseSlugs300opt[0][1]}`, inPlanCourseSlugs400);
      return missingRequirements;
    } if (((_.difference(inPlanCourseSlugs300opt[1], studentCompletedCourseSlugs300op[1])).length === 2)) {
      // return "ics_313, ics_361"
      const missingRequirements = _.concat(needsWork, `${inPlanCourseSlugs300opt[1][0]},${inPlanCourseSlugs300opt[1][1]}`, inPlanCourseSlugs400);
      return missingRequirements;

    }
      const missingRequirements = _.concat(needsWork, inPlanCourseSlugs400);
      return missingRequirements;


  }

  private isAcademicPlanCompleted = (student) => {
    const studentCompletedCourses = CourseInstances.find({ verified: true, studentID: student.userID }).fetch();
    const studentAcademicPlanDoc = AcademicPlans.findDoc(student.academicPlanID);
    if (_.difference(studentAcademicPlanDoc.courseList, studentCompletedCourses).length === 0) {
      return true;
    }
      return false;

  }


  private getStudentEmailsByLevel = (level) => {
    const emailaddresses = [];
    const studentLevel = parseInt(level, 10);
    const students = StudentProfiles.findNonRetired({ level: studentLevel }); // array of objects
    _.map(students, (profile) => {
      emailaddresses.push(profile.username);
    });
    return emailaddresses;
  }

  private getAllUsersEmails = () => {
    const allUsers = Meteor.users.find().fetch();
    const emailAddresses = [];
    _.map(allUsers, (profile) => {
      emailAddresses.push(profile.username);
    });
    return emailAddresses;
  }

  public render() {
    return (
      <div>
        {/* Auto Forms */}
        <Segment padded>
          <Header dividing as="h4">NEWSLETTER OPTIONS</Header>
          <AutoForm schema={schema} onChange={this.handleChange}>
            <TextField name="subjectLine" />
            <TextField name="bcc" />
            <Form.Group widths="equal">
              <LongTextField name="inputMessage" />
              <AdminAnalyticsNewsletterMessagePreviewWidget message={this.state.onSubmitInputMessage} />
            </Form.Group>
            <Button color="green" basic onClick={this.onClickPreviewSave}>Preview And Save</Button>
            <Header as="h4" dividing>SEND NEWSLETTER</Header>
            <TextField name="studentEmails" />
            <BoolField name="sendToStudentsToo" />
            <Button basic color="green" onClick={this.onClickSendStudentsToo}>Send To Admin</Button>

            <NumField name="level" placeholder="level" />
            <BoolField name="sendToLevels" />
            {/* eslint-disable-next-line react/button-has-type */}
            <button
              className="ui basic green button"
              disabled={!this.state.sendToLevels}
              onClick={this.onClickSendLevels}
            >
              Send To Students
            </button>
            <Form.Field label="Generate To Send To All Users" />
            <BoolField name="sendToAll" />
            {/* eslint-disable-next-line react/button-has-type */}
            <button
              className="ui basic green button"
              disabled={!this.state.sendToAll}
              onClick={this.onClickSendToAll}
            >
              Send To All
            </button>
          </AutoForm>
        </Segment>
      </div>
    );
  }
}

export default withRouter(AdminAnalyticsNewsletterWidget);
