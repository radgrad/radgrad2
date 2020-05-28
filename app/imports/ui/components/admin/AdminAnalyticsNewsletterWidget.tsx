import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Header, Form, Button } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, BoolField, NumField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';
import _ from 'lodash';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { IStudentProfile } from '../../../typings/radgrad';
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
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import { Reviews } from '../../../api/review/ReviewCollection';

interface IHtml {
  header?: string;
  info?: string;
}
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

const iceRecHelper = (student: IStudentProfile, value, component): string => {
  let html = '';
  if (value >= 100) {
    html += `Congratulations! You have achieved 100 ${iceMap[component].name} points!`;
    return html;
  }
  if (value < 30) {
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
};
const iceRecommendation = (student: IStudentProfile): IHtml | string => {
  const ice = StudentProfiles.getProjectedICE(student.username);
  if (ice.i >= 100 && ice.c >= 100 && ice.e >= 100) {
    return '';
  }
  const html: IHtml = {};
  html.header = 'Finish Your Degree Plan';
  html.info = '<p>To achieve a complete degree plan, obtain 100 points in each ICE component!</p>';
  _.each(ice, function (value, component) {
    let iceLevel = '';
    if (value < 30) {
      iceLevel = '<span style="color: red;"><strong>NEEDS WORK</strong></span>';
    } else if (value < 60) {
      iceLevel = '<span style="color: orange;"><strong>NEEDS WORK</strong></span>';
    } else {
      iceLevel = '<span style="color: green;"><strong>GOOD</strong></span>';
    }
    html.info += `<p><span style="color: ${iceMap[component].color}">${iceMap[component].name} (${value} points)</span>
      : ${iceLevel}</p>`;
    html.info += `<ul><li>${iceRecHelper(student, value, component)}</li></ul>`;
  });
  return html;
};
const levelRecommendation = (student: IStudentProfile): IHtml | string => {
  if (student.level > 5) {
    return '';
  }
  const html: IHtml = {};
  html.header = 'Level Up and Upgrade Your RadGrad Sticker';
  html.info = '<img src='
    + `"https://radgrad.ics.hawaii.edu/images/level-icons/radgrad-level-${student.level}-icon.png"`
    + ' width="100" height="100" style="float: left; margin: 0 10px;">';
  html.info += `<p style="color: #6FBE44;"><strong>Current Level: ${student.level}</strong></p>`;
  html.info += '<p><em>Swing by your advisor\'s office or POST 307 to pick up a laptop sticker for'
    + ' your current level if you haven\'t already!</em></p>';
  html.info += `<p>${levelMap[student.level]}</p>`;
  if (student.level < 6) {
    html.info += '<p>View your <a style="color: #6FBE44; font-weight: bold" '
      + `href="https://radgrad.ics.hawaii.edu/student/${student.username}/home/levels">Level Page</a>`
      + ' to view specific level requirements.</p>';
  }
  return html;
};
const verifyOppRecommendation = (student: IStudentProfile): IHtml | string => {
  const unverifiedOpps = OpportunityInstances.find({ studentID: student.userID, verified: false }).fetch();
  const currentUnverifiedOpps = _.filter(unverifiedOpps, function (unverifiedOpp) {
    const { termID } = unverifiedOpp;
    const { termNumber } = AcademicTerms.findOne({ _id: termID });
    if (termNumber <= AcademicTerms.getCurrentAcademicTermDoc().termNumber) {
      return true;
    }
    return false;
  });
  if (currentUnverifiedOpps.length === 0) {
    return '';
  }
  const html: IHtml = {};
  html.header = 'Verify Your Opportunities';
  html.info = '<p>You have unverified opportunities. To verify them, visit your RadGrad Degree Planner and'
    + ' click on the opportunity with the red question mark.'
    + ' <img src='
    + '"https://radgrad.ics.hawaii.edu/images/help/degree-planner-unverified-opportunity.png" width="100"> Select '
    + 'the opportunity you want to verify in your planner'
    + ' and it should be displayed in the Details tab, along with an option at the bottom to request verification.'
    + ' You must supply a brief explanation of how you participated. There may be additional requirements in addition '
    + 'to requesting the verification. Here is a list of'
    + ' past or current opportunities that you have not yet verified:</p>';
  html.info += '<ul>';
  _.each(currentUnverifiedOpps, function (unverifiedOpp) {
    const { termID } = unverifiedOpp;
    const termName = AcademicTerms.toString(termID, false);
    const opp = Opportunities.findOne({ _id: unverifiedOpp.opportunityID });
    const oppSlug = Slugs.getNameFromID(opp.slugID);
    html.info += '<li><a style="color: #6FBE44; font-weight: bold"'
      + ` href="https://radgrad.ics.hawaii.edu/student/${student.username}`
      + `/explorer/opportunities/${oppSlug}">${opp.name} (${termName})</a></li>`;
  });
  html.info += '</ul>';
  return html;
};
const reviewCourseRecommendation = (student: IStudentProfile): IHtml | string => {
  const completedCourses = _.map(CourseInstances.find({ studentID: student.userID, verified: true }).fetch(),
    function (instance) {
      return instance.courseID;
    });
  const nonReviewedCourses = _.filter(completedCourses, function (courseID) {
    return !(Reviews.findOne({ studentID: student.userID, revieweeID: courseID }));
  });
  if (nonReviewedCourses.length === 0) {
    return '';
  }
  let suggestedReviewCourses = [];
  const remainingCourses = [];
  _.each(nonReviewedCourses, function (courseID) {
    if (Reviews.findOne({ revieweeID: courseID }) === undefined) {
      suggestedReviewCourses.push(courseID);
    } else {
      remainingCourses.push(courseID);
    }
  });
  suggestedReviewCourses = suggestedReviewCourses.concat(remainingCourses);
  const html: IHtml = {};
  html.header = 'Review Courses You Have Completed';
  html.info = '<p>Contribute to the ICS community by providing reviews for courses you have completed.'
    + ' Here are some suggested courses to review:</p>';
  html.info += '<ul>';
  _.each(suggestedReviewCourses, function (courseID, index) {
    if (index === 3) {
      return false;
    }
    const courseSlug = Slugs.getNameFromID(Courses.findDoc(courseID).slugID);
    const courseName = Courses.findDocBySlug(courseSlug).shortName;
    html.info += '<li><a style="color: #6FBE44; font-weight: bold"'
      + ` href="https://radgrad.ics.hawaii.edu/student/${student.username}`
      + `/explorer/courses/${courseSlug}">${courseName}</a></li>`;
    return true;
  });
  html.info += '</ul>';
  return html;
};
const reviewOppRecommendation = (student: IStudentProfile): IHtml | string => {
  const completedOpps = _.map(OpportunityInstances.find({ studentID: student.userID, verified: true }).fetch(),
    function (instance) {
      return instance.opportunityID;
    });
  const nonReviewedOpps = _.filter(completedOpps, function (oppID) {
    return !(Reviews.findOne({ studentID: student.userID, revieweeID: oppID }));
  });
  if (nonReviewedOpps.length === 0) {
    return '';
  }
  let suggestedReviewOpps = [];
  const remainingOpps = [];
  _.each(nonReviewedOpps, function (oppID) {
    if (Reviews.findOne({ revieweeID: oppID }) === undefined) {
      suggestedReviewOpps.push(oppID);
    } else {
      remainingOpps.push(oppID);
    }
  });
  suggestedReviewOpps = suggestedReviewOpps.concat(remainingOpps);
  suggestedReviewOpps = _.uniq(suggestedReviewOpps);
  const html: IHtml = {};
  html.header = 'Review Opportunities You Have Completed';
  html.info = '<p>Contribute to the ICS community by providing reviews for opportunities you have completed.'
    + ' Here are some suggested opportunities to review:</p>';
  html.info += '<ul>';
  _.each(suggestedReviewOpps, function (oppID, index) {
    if (index === 3) {
      return false;
    }
    const oppSlug = Slugs.getNameFromID(oppID);
    const oppName = Opportunities.findDocBySlug(oppSlug).name;
    html.info += '<li><a style="color: #6FBE44; font-weight: bold"'
      + ` href="https://radgrad.ics.hawaii.edu/student/${student.username}`
      + `/explorer/opportunities/${oppSlug}">${oppName}</a></li>`;
    return true;
  });
  html.info += '</ul>';
  return html;
};
const visitMentorRecommendation = (student: IStudentProfile): IHtml => {
  const html: IHtml = {};
  html.header = 'Visit The Mentor Space';
  html.info = '<p>Connect with RadGrad mentors to learn more about future opportunities and careers, or if you simply'
    + ' have questions regarding your current degree track. Visit the <a style="color: #6FBE44; font-weight: bold"'
    + ` href="https://radgrad.ics.hawaii.edu/student/${student.username}/mentor-space">Mentor Space</a>`
    + ' page to get started!</p>';
  return html;
};
const recList = [iceRecommendation, verifyOppRecommendation, levelRecommendation,
  reviewCourseRecommendation, reviewOppRecommendation, visitMentorRecommendation];
const getRecList = (student: IStudentProfile) => {
  const suggestedRecs = [];
  _.each(recList, function (func) {
    const html = func(student);
    if (html) {
      suggestedRecs.push(html);
    }
  });
  return suggestedRecs;
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

const AdminAnalyticsNewsletterWidget = (props: IAdminAnalyticsNewsletterWidget) => {
// class AdminAnalyticsNewsletterWidget extends React.Component<IAdminAnalyticsNewsletterWidget, IAdminAnalyticsNewsletterWidgetState> {
  const [inputMessage, setInputMessage] = useState('');
  const [onSubmitInputMessage, setOnSubmitInputMessage] = useState('');
  const [bcc, setBcc] = useState('');
  const [subjectLine, setSubjectLine] = useState('');
  const [studentEmails, setStudentEmails] = useState('');
  const [sendToStudentsToo, setSendToStudentsToo] = useState(false);
  const [level, setLevel] = useState(0);
  const [sendToLevels, setSendToLevels] = useState(false);
  const [sendToAll, setSendToAll] = useState(false);
  const [message, setMessage] = useState({});

  /** Auto Forms */
    // check on this https://stackoverflow.com/questions/38558200/react-setstate-not-updating-immediately
  const handleChange = (name, value) => {
    // console.log('handleChange', name, value);
      switch (name) {
        case 'inputMessage':
          setInputMessage(value);
          break;
        case 'onSubmitInputMessage':
          setOnSubmitInputMessage(value);
          break;
        case 'bcc':
          setBcc(value);
          break;
        case 'subjectLine':
          setSubjectLine(value);
          break;
        case 'studentEmails':
          setStudentEmails(value);
          break;
        case 'sendToStudentsToo':
          setSendToStudentsToo(value);
          break;
        case 'level':
          setLevel(parseInt(value, 10));
          break;
        case 'sendToLevels':
          setSendToLevels(value === 'true');
          break;
        case 'sentToAll':
          setSendToAll(value === 'true');
          break;
        default:
        // do nothing
      }
    };

  const onClickPreviewSave = () => {
    setOnSubmitInputMessage(inputMessage);
  };

  const onClickSendStudentsToo = () => {
    const studentEmailsArr = studentEmails.split(',');
    const bccListArray = _.map(bcc.split(','), email => email.trim());
    const adminEmail = RadGradProperties.getAdminEmail();
    const from = RadGradProperties.getNewsletterFrom();
    const adminMessage = $('.adminMessage').html();
    _.forEach(studentEmailsArr, (studentEmail) => {
      const student = StudentProfiles.findByUsername(studentEmail);
      if (student) {
        const suggestedRecs = getRecList(student);
        const sendList = [];
        sendList.push(adminEmail); // always send to admin
        if (sendToStudentsToo) {
          sendList.push(studentEmail);
        }
        const emailData: any = {};
        emailData.to = sendList;
        emailData.bcc = bccListArray;
        emailData.from = from;
        emailData.replyTo = 'radgrad@hawaii.edu';
        emailData.subject = `Newsletter View For ${student.firstName} ${student.lastName}`;
        emailData.templateData = {
          adminMessage,
          firstName: student.firstName,
          firstRec: suggestedRecs[0],
          secondRec: suggestedRecs[1],
          thirdRec: suggestedRecs[2],
        };
        emailData.filename = 'newsletter2.html';
        sendEmailMethod.call(emailData, (error) => {
          if (error) {
            console.error('Error sending email.', error);
          } else {
            Swal.fire('Email sent to admin');
          }
        });
      }
    });
  };

  const onClickSendLevels = () => {
    if (onSubmitInputMessage.length !== 0 && subjectLine.length !== 0 && level !== 0) {
      setMessage({
        // eslint-disable-next-line react/no-access-state-in-setstate
        subjectLine,
        // eslint-disable-next-line react/no-access-state-in-setstate
        bcc: bcc.split(','),
        // eslint-disable-next-line react/no-access-state-in-setstate
        inputMessage: onSubmitInputMessage,
        // eslint-disable-next-line react/no-access-state-in-setstate
        recipients: getStudentEmailsByLevel(level),
      });
      generateEmail(message);
      Swal.fire(
        'Good Job, email sent!',
      );
    } else {
      Swal.fire(
        'You forgot to fill something out!',
      );
    }
  };

  const onClickSendToAll = () => {
    if (onSubmitInputMessage.length !== 0 && subjectLine.length !== 0) {
      setMessage({
        // eslint-disable-next-line react/no-access-state-in-setstate
        subjectLine,
        // eslint-disable-next-line react/no-access-state-in-setstate
        bcc: bcc.split(','),
        // eslint-disable-next-line react/no-access-state-in-setstate
        inputMessage: onSubmitInputMessage,
        recipients: getAllUsersEmails(),
      });
      generateEmail(message);
      Swal.fire(
        'Good Job, email sent!',
      );
    } else {
      Swal.fire(
        'You forgot to fill something out!',
      );
    }
  };

  const generateEmail = (m) => {
    console.log('generateEmail', m);
    const adminEmail = RadGradProperties.getAdminEmail();
    const newsletterFrom = RadGradProperties.getNewsletterFrom();
    const emailData = {
      to: m.recipients,
      from: newsletterFrom,
      subject: '',
      replyTo: adminEmail,
      templateData: {
        adminMessage: m.inputMessage,
        firstName: '',
        lastName: '',
        firstRec: '',
        secondRec: '',
        thirdRec: '',
      },
      filename: 'newsletter2.html',
    };
    _.map(m.recipients, (username) => {
      const informationForEmail = getInformationForEmail(username);
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
  };

  const getInformationForEmail = (username) => {
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
      const recommendations = getRecommendations(student); // array
      informationForEmail.recipientInfo.username = student.username;
      informationForEmail.recipientInfo.firstName = student.firstName;
      informationForEmail.recipientInfo.lastName = student.lastName;
      informationForEmail.emailInfo.recommendationOne = recommendations[0];
      informationForEmail.emailInfo.recommendationTwo = recommendations[1];
      informationForEmail.emailInfo.recommendationThree = recommendations[2];
    }
    // }
    return informationForEmail;
  };

  const getRecommendations = (student) => {
    const recommendations = [];
    recommendations.push(getRecommendationsICE(student));
    recommendations.push(getRecommendationsLevel(student));
    recommendations.push(getRecommendationsAcademicPlan(student));
    return recommendations;
  };

  const getRecommendationsICE = (student) => {
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
        iCERec.info += `<ul><li>${iceRecHelper(student, value, component)}</li></ul>`;
      });
      return iCERec;
    }
    const complete = {
      header: 'You Have Completed Your Degree Plan',
    };
    return complete;
  };

  const getRecommendationsLevel = (student) => ({
    header: 'Level Up and Upgrade Your RadGrad Sticker',
    info: `<img alt="radgrad icon" src="https://radgrad.ics.hawaii.edu/images/level-icons/radgrad-level-${student.level}-icon.png" width="100" height="100" style="float: left; margin: 0 10px;"/> <p style="color: #6FBE44;"><strong>Current Level: ${student.level}</strong></p> <p><em>Swing by your advisor's office or POST 307 to pick up a laptop sticker for your current level if you haven't already!</em></p> <p>${levelMap[student.level]}</p><a style="color: #6FBE44; font-weight: bold" href="https://radgrad.ics.hawaii.edu/">Take me to RadGrad!</a>`,
  });

  const getRecommendationsAcademicPlan = (student) => {
    const studentAcademicPlanDoc = AcademicPlans.findDoc(student.academicPlanID);
    const academicPlanSlug = Slugs.getNameFromID(studentAcademicPlanDoc.slugID);
    const remainingReqs = getRemainingRequirements(student, studentAcademicPlanDoc);

    const html = {
      header: 'Complete Your Academic Plan',
      info: `<p>Your Current Academic Plan: <a style ="color: #6FBE44; font-weight: bold" href = "https://radgrad.ics.hawaii.edu/student/${student.username}
       /explorer/plans/${academicPlanSlug}">${studentAcademicPlanDoc.name}</a></p>`,
    };
    if (isAcademicPlanCompleted(student) === false) {
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
  };

  const getRemainingRequirements = (student, studentAcademicPlanDoc) => {
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
    }
    if (((_.difference(inPlanCourseSlugs300opt[0], studentCompletedCourseSlugs300op[0])).length === 2)) {
      const missingRequirements = _.concat(needsWork, `${inPlanCourseSlugs300opt[0][0]},${inPlanCourseSlugs300opt[0][1]}`, inPlanCourseSlugs400);
      return missingRequirements;
    }
    if (((_.difference(inPlanCourseSlugs300opt[1], studentCompletedCourseSlugs300op[1])).length === 2)) {
      // return "ics_313, ics_361"
      const missingRequirements = _.concat(needsWork, `${inPlanCourseSlugs300opt[1][0]},${inPlanCourseSlugs300opt[1][1]}`, inPlanCourseSlugs400);
      return missingRequirements;

    }
    const missingRequirements = _.concat(needsWork, inPlanCourseSlugs400);
    return missingRequirements;
  };

  const isAcademicPlanCompleted = (student) => {
    const studentCompletedCourses = CourseInstances.find({ verified: true, studentID: student.userID }).fetch();
    const studentAcademicPlanDoc = AcademicPlans.findDoc(student.academicPlanID);
    if (_.difference(studentAcademicPlanDoc.courseList, studentCompletedCourses).length === 0) {
      return true;
    }
    return false;
  };


  const getStudentEmailsByLevel = (lvl) => {
    const emailaddresses = [];
    const studentLevel = parseInt(lvl, 10);
    const students = StudentProfiles.findNonRetired({ level: studentLevel }); // array of objects
    _.map(students, (profile) => {
      emailaddresses.push(profile.username);
    });
    return emailaddresses;
  };

  const getAllUsersEmails = () => {
    const allUsers = Meteor.users.find().fetch();
    const emailAddresses = [];
    _.map(allUsers, (profile) => {
      emailAddresses.push(profile.username);
    });
    return emailAddresses;
  };

  return (
    <div>
      {/* Auto Forms */}
      <Segment padded>
        <Header dividing as="h4">NEWSLETTER OPTIONS</Header>
        <AutoForm schema={schema} onChange={handleChange}>
          <TextField name="subjectLine" />
          <TextField name="bcc" />
          <Form.Group widths="equal">
            <LongTextField name="inputMessage" />
            <AdminAnalyticsNewsletterMessagePreviewWidget message={onSubmitInputMessage} />
          </Form.Group>
          <Button color="green" basic onClick={onClickPreviewSave}>Preview And Save</Button>
          <Header as="h4" dividing>SEND NEWSLETTER</Header>
          <TextField name="studentEmails" />
          <BoolField name="sendToStudentsToo" />
          <Button basic color="green" onClick={onClickSendStudentsToo}>Send To Admin</Button>

          <NumField name="level" placeholder="level" />
          <BoolField name="sendToLevels" />
          {/* eslint-disable-next-line react/button-has-type */}
          <button
            className="ui basic green button"
            disabled={!sendToLevels}
            onClick={onClickSendLevels}
          >
            Send To Students
          </button>
          <Form.Field label="Generate To Send To All Users" />
          <BoolField name="sendToAll" />
          {/* eslint-disable-next-line react/button-has-type */}
          <button
            className="ui basic green button"
            disabled={!sendToAll}
            onClick={onClickSendToAll}
          >
            Send To All
          </button>
        </AutoForm>
      </Segment>
    </div>
  );
};

export default withRouter(AdminAnalyticsNewsletterWidget);
