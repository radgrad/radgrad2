import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { getEarnedICE, getProjectedICE } from '../ice/IceProcessor';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Reviews } from '../review/ReviewCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { updateMethod } from '../base/BaseCollection.methods';
import { RadGrad } from '../radgrad/RadGrad';
import { Ice, StudentProfileUpdate } from '../../typings/radgrad';

/**
 * Calculates the given student's Level.
 * @param studentID the studentID.
 * @returns {number}
 * @memberOf api/level
 */
export const defaultCalcLevel = (studentID: string): number => {
  const instances = _.concat(CourseInstances.find({ studentID })
    .fetch(),
  OpportunityInstances.find({ studentID })
    .fetch());
  const earnedICE: Ice = getEarnedICE(instances);
  const plannedICE: Ice = getProjectedICE(instances);
  const numReviews: number = Reviews.find({ studentID, visible: true })
    .count();
  // console.log('defaultCalcLevel', earnedICE, plannedICE, numReviews);
  let level = 1;
  if (Meteor.isTest) {
    return testCalcLevel(studentID);
  }
  if (earnedICE.i >= Meteor.settings.public.level.six.earnedICE.i &&
    earnedICE.c >= Meteor.settings.public.level.six.earnedICE.c &&
    earnedICE.e >= Meteor.settings.public.level.six.earnedICE.e &&
    numReviews >= Meteor.settings.public.level.six.reviews &&
    plannedICE.i >= Meteor.settings.public.level.six.plannedICE.i &&
    plannedICE.c >= Meteor.settings.public.level.six.plannedICE.c &&
    plannedICE.e >= Meteor.settings.public.level.six.plannedICE.e) {
    level = 6;
  } else if (earnedICE.i >= Meteor.settings.public.level.five.earnedICE.i &&
    earnedICE.c >= Meteor.settings.public.level.five.earnedICE.c &&
    earnedICE.e >= Meteor.settings.public.level.five.earnedICE.e &&
    numReviews >= Meteor.settings.public.level.five.reviews &&
    plannedICE.i >= Meteor.settings.public.level.five.plannedICE.i &&
    plannedICE.c >= Meteor.settings.public.level.five.plannedICE.c &&
    plannedICE.e >= Meteor.settings.public.level.five.plannedICE.e) {
    level = 5;
  } else if (earnedICE.i >= Meteor.settings.public.level.four.earnedICE.i &&
    earnedICE.c >= Meteor.settings.public.level.four.earnedICE.c &&
    earnedICE.e >= Meteor.settings.public.level.four.earnedICE.e &&
    numReviews >= Meteor.settings.public.level.four.reviews &&
    plannedICE.i >= Meteor.settings.public.level.four.plannedICE.i &&
    plannedICE.c >= Meteor.settings.public.level.four.plannedICE.c &&
    plannedICE.e >= Meteor.settings.public.level.four.plannedICE.e) {
    level = 4;
  } else if (earnedICE.i >= Meteor.settings.public.level.three.earnedICE.i &&
    earnedICE.c >= Meteor.settings.public.level.three.earnedICE.c &&
    earnedICE.e >= Meteor.settings.public.level.three.earnedICE.e &&
    numReviews >= Meteor.settings.public.level.three.reviews &&
    plannedICE.i >= Meteor.settings.public.level.three.plannedICE.i &&
    plannedICE.c >= Meteor.settings.public.level.three.plannedICE.c &&
    plannedICE.e >= Meteor.settings.public.level.three.plannedICE.e) {
    level = 3;
  } else if (earnedICE.i >= Meteor.settings.public.level.two.earnedICE.i &&
    earnedICE.c >= Meteor.settings.public.level.two.earnedICE.c &&
    earnedICE.e >= Meteor.settings.public.level.two.earnedICE.e &&
    numReviews >= Meteor.settings.public.level.two.reviews &&
    plannedICE.i >= Meteor.settings.public.level.two.plannedICE.i &&
    plannedICE.c >= Meteor.settings.public.level.two.plannedICE.c &&
    plannedICE.e >= Meteor.settings.public.level.two.plannedICE.e) {
    level = 2;
  }
  // console.log('defaultCalcLevel', studentID, earnedICE, plannedICE, numReviews, level);
  return level;
};

export const testCalcLevel = (studentID: string): number => {
  const instances = _.concat(CourseInstances.find({ studentID })
    .fetch(),
  OpportunityInstances.find({ studentID })
    .fetch());
  const earnedICE: Ice = getEarnedICE(instances);
  const plannedICE: Ice = getProjectedICE(instances);
  const numReviews: number = Reviews.find({ studentID, reviewType: 'course', moderated: true, visible: true })
    .count();
  const hasPicture: boolean = StudentProfiles.hasSetPicture(studentID);
  // console.log('defaultCalcLevel', earnedICE, plannedICE, numReviews, hasPicture);
  let level = 1;
  if (earnedICE.i >= 100 &&
    earnedICE.c >= 100 &&
    earnedICE.e >= 100 &&
    numReviews >= 6 &&
    plannedICE.i >= 100 &&
    plannedICE.c >= 100 &&
    plannedICE.e >= 100 &&
    hasPicture) {
    level = 6;
  } else if (earnedICE.i >= 80 &&
    earnedICE.c >= 80 &&
    earnedICE.e >= 80 &&
    numReviews >= 1 &&
    plannedICE.i >= 100 &&
    plannedICE.c >= 100 &&
    plannedICE.e >= 100 &&
    hasPicture) {
    level = 5;
  } else if (earnedICE.i >= 30 &&
    earnedICE.c >= 36 &&
    earnedICE.e >= 30 &&
    numReviews >= 0 &&
    plannedICE.i >= 100 &&
    plannedICE.c >= 100 &&
    plannedICE.e >= 100 &&
    hasPicture) {
    level = 4;
  } else if ((earnedICE.i >= 1 ||
    earnedICE.e >= 1) &&
    earnedICE.c >= 24 &&
    numReviews >= 0) {
    level = 3;
  } else if (earnedICE.i >= 0 &&
    earnedICE.c >= 12 &&
    earnedICE.e >= 0 &&
    numReviews >= 0) {
    level = 2;
  }
  // console.log('defaultCalcLevel', studentID, earnedICE, plannedICE, numReviews, hasPicture, level);
  return level;
};

/**
 * Updates the student's level.
 * @param studentID the studentID.
 * @memberOf api/level
 */
export const updateStudentLevel = (studentID: string) => {
  let level;
  let leveledUp = false;
  if (RadGrad.calcLevel) {
    level = RadGrad.calcLevel(studentID);
  } else {
    level = defaultCalcLevel(studentID);
  }
  const profile = StudentProfiles.getProfile(studentID);
  if (profile.level !== level) {
    leveledUp = true;
    const collectionName = StudentProfiles.getCollectionName();
    const updateData: StudentProfileUpdate = {};
    updateData.id = profile._id;
    updateData.lastLeveledUp = moment().format('YYYY-MM-DD');
    updateMethod.call({ collectionName, updateData }, (err) => {
      if (err) {
        console.error('Failed to update lastLeveledUp', err);
      }
    });
  }
  StudentProfiles.setLevel(studentID, level);
  return leveledUp ? `You have advanced to Level ${level}` : `You remain at Level ${level}`;
};

/**
 * Updates all the students level.
 * @memberOf api/level
 * @return The number of student profiles checked for updating.
 */
export const updateAllStudentLevels = (): number => {
  console.log('Starting: Update all student levels.');
  StudentProfiles.find().forEach((student) => {
    updateStudentLevel(student.userID);
  });
  const numChecked = StudentProfiles.find().count();
  console.log(`Checked ${numChecked} student levels.`);
  return numChecked;
};

/**
 * Updates all the students level via a cron job.
 * The important difference is that this code runs without a logged in user.
 * Therefore, we cannot call the standard updateMethod, which requires a logged in user.
 * @memberOf api/level
 * @return The number of student profiles checked for updating.
 */
export const updateAllStudentLevelsCron = (): number => {
  console.log('Starting: Update all student levels (cron).');
  StudentProfiles.find().forEach((student) => {
    const studentID = student.userID;
    const level = (RadGrad.calcLevel) ? RadGrad.calcLevel(studentID) : defaultCalcLevel(studentID);
    const profile = StudentProfiles.getProfile(studentID);
    if (profile.level !== level) {
      StudentProfiles.setLevel(studentID, level);
      StudentProfiles.setLastLeveledUp(studentID);
    }
  });
  const numChecked = StudentProfiles.find().count();
  console.log(`Checked ${numChecked} student levels.`);
  return numChecked;
};

export const getLevelCriteriaStringMarkdown = (level: string): string => {
  if (!(['six', 'five', 'four', 'three', 'two'].includes(level))) {
    throw new Meteor.Error(`${level} is not a valid level`);
  }
  const criteria = Meteor.settings.public.level[level];
  let plannedICEStr = '';
  if (criteria.plannedICE.i !== 0 || criteria.plannedICE.c !== 0 || criteria.plannedICE.e !== 0) {
    plannedICEStr = '+ Planned myICE of';
    if (criteria.plannedICE.i !== 0) {
      plannedICEStr = `${plannedICEStr} **I >= ${criteria.plannedICE.i},`;
    }
    if (criteria.plannedICE.c !== 0) {
      plannedICEStr = `${plannedICEStr} C >= ${criteria.plannedICE.c},`;
    }
    if (criteria.plannedICE.e !== 0) {
      plannedICEStr = `${plannedICEStr} E >= ${criteria.plannedICE.e}**`;
    }
  }
  let earnedICEStr = '';
  if (criteria.earnedICE.i !== 0 || criteria.earnedICE.c !== 0 || criteria.earnedICE.e !== 0) {
    earnedICEStr = '+ Earned myICE of';
    if (criteria.earnedICE.i !== 0) {
      earnedICEStr = `${earnedICEStr} **I >= ${criteria.earnedICE.i},`;
    }
    if (criteria.earnedICE.c !== 0 && criteria.earnedICE.e !== 0) {
      earnedICEStr = `${earnedICEStr} C >= ${criteria.earnedICE.c},`;
    }
    if (criteria.earnedICE.c !== 0 && criteria.earnedICE.e === 0) {
      earnedICEStr = `${earnedICEStr} **C >= ${criteria.earnedICE.c}**`;
    }
    if (criteria.earnedICE.e !== 0) {
      earnedICEStr = `${earnedICEStr} E >= ${criteria.earnedICE.e}**`;
    }
  }
  let reviewsStr = '';
  if (criteria.reviews > 1) {
    reviewsStr = `+ **${criteria.reviews}** reviews of courses or opportunities`;
  } else if (criteria.reviews === 1) {
    reviewsStr = `+ **${criteria.reviews}** review of a course or opportunity`;
  }
  let criteriaString = '';
  if (plannedICEStr !== '' && earnedICEStr !== '' && reviewsStr !== '') {
    criteriaString = `

${plannedICEStr}
    
${earnedICEStr}

${reviewsStr}`;
  } else if (plannedICEStr !== '' && earnedICEStr !== '' && reviewsStr === '') {
    criteriaString = `

${plannedICEStr}

${earnedICEStr}`;
  } else if (plannedICEStr === '' && earnedICEStr !== '' && reviewsStr === '') {
    criteriaString = `
    
${earnedICEStr}`;
  }
  return criteriaString;
};

export const getLevelHintStringMarkdown = (level: string): string => {
  let result = '';
  switch (level) {
    case 'six':
      result = `
${getLevelCriteriaStringMarkdown(level)}.`;
      break;
    case 'five':
      result = `
 ${getLevelCriteriaStringMarkdown(level)}.`;
      break;
    case 'four':
      result = `
${getLevelCriteriaStringMarkdown(level)}.`;
      break;
    case 'three':
      result = `
${getLevelCriteriaStringMarkdown(level)}.`;
      break;
    case 'two':
      result = `
${getLevelCriteriaStringMarkdown(level)}.`;
      break;
    default:
    // eslint-disable-next-line max-len
      result = 'You begin your RadGrad experience at Level 1, and you will receive this laptop sticker when you first sign up for RadGrad with your advisor. *"A journey of a thousand miles begins with a single step" -- Lao Tzu*';
  }
  return result;
};

export const getLevelCongratsMarkdown = (level: number): string => {
  let result = '';
  switch (level) {
    case 5:
      result = 'To get to Level 6: Complete your degree plan, and do some reviews.';
      break;
    case 4:
      result = 'To get to Level 5: Be well on your way to a completed degree plan';
      break;
    case 3:
      result = 'To get to Level 4: Complete several semesters of coursework plus some verified opportunities.';
      break;
    case 2:
      result = 'To get to Level 3: Complete your second semester of coursework with decent grades.';
      break;
    case 1:
      result = 'To get to Level 2: Successfully finish your first semester of coursework.';
      break;
    default:
      result = '';
  }
  return result;
};
