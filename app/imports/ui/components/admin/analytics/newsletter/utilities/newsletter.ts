import _ from 'lodash';
import { StudentProfiles } from '../../../../../../api/user/StudentProfileCollection';
import { CourseInstance, Opportunity, OpportunityInstance, StudentProfile } from '../../../../../../typings/radgrad';
import { Users } from '../../../../../../api/user/UserCollection';
import { Courses } from '../../../../../../api/course/CourseCollection';
import { CourseInstances } from '../../../../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../../../../api/academic-term/AcademicTermCollection';
import { Slugs } from '../../../../../../api/slug/SlugCollection';
import { Reviews } from '../../../../../../api/review/ReviewCollection';

interface Html {
  header?: string;
  info?: string;
}

export interface EmailData {
  to: string | string[];
  bcc: string[];
  from: string;
  replyTo: string;
  subject: string;
  templateData: {
    adminMessage: any;
    firstName: string;
    firstRec: Html | string;
    secondRec: Html | string;
    thirdRec: Html | string;
  }
  filename: string;
}

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

const iceRecHelper = (student: StudentProfile, value, component): string => {
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
    const relevantCourses = _.filter(Courses.find().fetch(), function (course) {
      return _.some(course.interestIDs, interest => _.includes(studentInterests, interest));
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
    const opps = _.filter(Opportunities.find().fetch(), function (opp) {
      return opp.ice[component] > 0;
    });
    const relevantOpps = _.filter(opps, function (opp) {
      return _.some(opp.interestIDs, interest => _.includes(studentInterests, interest));
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

const iceRecommendation = (student: StudentProfile): Html | string => {
  const ice = StudentProfiles.getProjectedICE(student.username);
  if (ice.i >= 100 && ice.c >= 100 && ice.e >= 100) {
    return '';
  }
  const html: Html = {};
  html.header = 'Finish Your Degree Plan';
  html.info = '<p>To achieve a complete degree plan, obtain 100 points in each ICE component!</p>';
  _.each(ice, function (value, component) {
    let iceLevel;
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

const verifyOppRecommendation = (student: StudentProfile): Html | string => {
  const unverifiedOpps: OpportunityInstance[] = OpportunityInstances.find({
    studentID: student.userID,
    verified: false,
  }).fetch();
  const currentUnverifiedOpps = _.filter(unverifiedOpps, function (unverifiedOpp) {
    const { termID } = unverifiedOpp;
    const { termNumber } = AcademicTerms.findOne({ _id: termID });
    return termNumber <= AcademicTerms.getCurrentAcademicTermDoc().termNumber;
  });
  if (currentUnverifiedOpps.length === 0) {
    return '';
  }
  const html: Html = {};
  html.header = 'Verify Your Opportunities';
  html.info = '<p>You have unverified opportunities. To verify them, visit your RadGrad Degree Planner and'
    + ' click on the opportunity with the red question mark.'
    + ' <img src='
    + '"https://radgrad.ics.hawaii.edu/images/help/degree-planner-unverified-opportunity.png" width="100" alt="degree-planner-unverified-opportunity.png"> '
    + 'Select the opportunity you want to verify in your planner'
    + ' and it should be displayed in the Details tab, along with an option at the bottom to request verification.'
    + ' You must supply a brief explanation of how you participated. There may be additional requirements in addition '
    + 'to requesting the verification. Here is a list of'
    + ' past or current opportunities that you have not yet verified:</p>';
  html.info += '<ul>';
  _.each(currentUnverifiedOpps, function (unverifiedOpp) {
    const { termID } = unverifiedOpp;
    const termName = AcademicTerms.toString(termID, false);
    const opp: Opportunity = Opportunities.findOne({ _id: unverifiedOpp.opportunityID });
    const oppSlug = Slugs.getNameFromID(opp.slugID);
    html.info += '<li><a style="color: #6FBE44; font-weight: bold"'
      + ` href="https://radgrad.ics.hawaii.edu/student/${student.username}`
      + `/explorer/opportunities/${oppSlug}">${opp.name} (${termName})</a></li>`;
  });
  html.info += '</ul>';
  return html;
};

const levelRecommendation = (student: StudentProfile): Html | string => {
  if (student.level > 5) {
    return '';
  }
  const html: Html = {};
  html.header = 'Level Up and Upgrade Your RadGrad Sticker';
  html.info = '<img src='
    + `"https://radgrad.ics.hawaii.edu/images/level-icons/radgrad-level-${student.level}-icon.png"`
    + ' width="100" height="100" style="float: left; margin: 0 10px;" alt="radgrad level icon">';
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

const reviewCourseRecommendation = (student: StudentProfile): Html | string => {
  const courseInstances: CourseInstance[] = CourseInstances.find({
    studentID: student.userID,
    verified: true,
  }).fetch();
  const completedCourses = _.map(courseInstances, function (instance) {
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
  const html: Html = {};
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

export const reviewOppRecommendation = (student: StudentProfile): Html | string => {
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
  const html: Html = {};
  html.header = 'Review Opportunities You Have Completed';
  html.info = '<p>Contribute to the ICS community by providing reviews for opportunities you have completed.'
    + ' Here are some suggested opportunities to review:</p>';
  html.info += '<ul>';
  _.each(suggestedReviewOpps, function (oppID, index) {
    if (index === 3) {
      return false;
    }
    const opportunity: Opportunity = Opportunities.findOne({ _id: oppID });
    const oppSlug = Slugs.findDoc(opportunity.slugID).name;
    const oppName = Opportunities.findDocBySlug(oppSlug).name;
    html.info += '<li><a style="color: #6FBE44; font-weight: bold"'
      + ` href="https://radgrad.ics.hawaii.edu/student/${student.username}`
      + `/explorer/opportunities/${oppSlug}">${oppName}</a></li>`;
    return true;
  });
  html.info += '</ul>';
  return html;
};

// TODO Currently we only use the first 3 of the recommendations for our Newsletter, we need to discuss if we should add more
// or implement a better system such that we can incorporate more recommendations on a rotational/conditional basis
const recList = [iceRecommendation, verifyOppRecommendation, levelRecommendation, reviewCourseRecommendation, reviewOppRecommendation];

export const getRecList = (student: StudentProfile) => {
  const suggestedRecs = [];
  _.each(recList, function (func) {
    const html = func(student);
    if (html) {
      suggestedRecs.push(html);
    }
  });
  return suggestedRecs;
};

export const getStudentEmailsByLevel = (level: number) => {
  const studentProfiles = StudentProfiles.find({ level, isAlumni: false }).fetch();
  return _.map(studentProfiles, (p) => p.username);
};
