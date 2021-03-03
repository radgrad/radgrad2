import * as fs from 'fs';
// import * as inquirer from 'inquirer';
import * as _ from 'lodash';
import moment from 'moment';
import { program } from 'commander';
import { getCollectionData, getCollectionDocFromSlug } from './data-dump-utils';

interface ICollection {
  name: string;
  contents: any[];
}

interface IDataDump {
  timestamp: string;
  collections: ICollection[];
}

const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

let radGrad1DataDump: IDataDump;

// const convertHelpRouteName = (name: string): string => {
//   switch (name) {
//     case 'Advisor_Student_Configuration_Page':
//       return '/advisor/:username/home';
//     case 'Advisor_Verification_Requests_Pending_Page':
//       return '/advisor/:username/verification-requests';
//     case 'Advisor_Event_Verification_Page':
//       return '/advisor/:username/event-verification';
//     case 'Advisor_Completed_Verifications_Page':
//       return '/advisor/:username/completed-verifications';
//     case 'Advisor_Academic_Plan_Page':
//       return '/advisor/:username/academic-plan';
//     case 'Advisor_Moderation_Page':
//       return '/advisor/:username/moderation';
//     case 'Faculty_Home_Page':
//       return '/faculty/:username/home';
//     case 'Faculty_Manage_Opportunities_Page':
//       return '/faculty/:username/manage-opportunities';
//     case 'Faculty_Explorer_Page':
//       return '/faculty/:username/explorer';
//     case 'Faculty_Explorer_CareerGoals_Page':
//       return '/faculty/:username/explorer/career-goals';
//     case 'Faculty_Explorer_Courses_Page':
//       return '/faculty/:username/explorer/courses';
//     case 'Faculty_Explorer_Plans_Page':
//       return '/faculty/:username/explorer/academic-plans';
//     case 'Faculty_Explorer_Interests_Page':
//       return '/faculty/:username/explorer/interests';
//     case 'Faculty_Explorer_Opportunities_Page':
//       return '/faculty/:username/explorer/opportunities';
//     case 'Faculty_Explorer_Users_Page':
//       return '/faculty/:username/explorer/users';
//     case 'Faculty_Verification_Page':
//       return '/faculty/:username/verification-requests';
//     case 'Mentor_Home_Page':
//       return '/mentor/:username/home';
//     case 'Mentor_Explorer_Page':
//       return '/mentor/:username/explorer';
//     case 'Mentor_Explorer_CareerGoals_Page':
//       return '/mentor/:username/explorer/career-goals';
//     case 'Mentor_Explorer_Courses_Page':
//       return '/mentor/:username/explorer/courses';
//     case 'Mentor_Explorer_Plans_Page':
//       return '/mentor/:username/explorer/academic-plans';
//     case 'Mentor_Explorer_Interests_Page':
//       return '/mentor/:username/explorer/interests';
//     case 'Mentor_Explorer_Opportunities_Page':
//       return '/mentor/:username/explorer/opportunities';
//     case 'Mentor_Explorer_Users_Page':
//       return '/mentor/:username/explorer/users';
//     case 'Mentor_MentorSpace_Page':
//       return '/mentor/:username/mentor-space';
//     case 'Student_Home_Page':
//       return '/student/:username/home';
//     case 'Student_Degree_Planner_Page':
//       return '/student/:username/degree-planner';
//     case 'Student_Home_AboutMe_Page':
//       return '/student/:username/home/about-me';
//     case 'Student_Home_Ice_Page':
//       return '/student/:username/home/ice';
//     case 'Student_Home_Levels_Page':
//       return '/student/:username/home/levels';
//     case 'Student_Ice':
//       return '/student/:username/ice';
//     case 'Student_Explorer_Page':
//       return '/student/:username/explorer';
//     case 'Student_MentorSpace_Page':
//       return '/student/:username/mentor-space';
//     case 'Student_Home_Log_Page':
//       return '/student/:username/home/log';
//     case 'Student_Explorer_CareerGoals_Page':
//       return '/student/:username/explorer/career-goals';
//     case 'Student_Explorer_Courses_Page':
//       return '/student/:username/explorer/courses';
//     case 'Student_Explorer_Plans_Page':
//       return '/student/:username/explorer/academic-plans';
//     case 'Student_Explorer_Interests_Page':
//       return '/student/:username/explorer/interests';
//     case 'Student_Explorer_Opportunities_Page':
//       return '/student/:username/explorer/opportunities';
//     case 'Student_Explorer_Users_Page':
//       return '/student/:username/explorer/users';
//     default:
//       return name;
//   }
// };

const convertObject = (item) => {
  const result: any = {};
  for (const key in item) { // eslint-disable-line
    // console.log(key);
    switch (key) {
      case 'coursesPerSemester':
        result.coursesPerAcademicTerm = item[key];
        break;
      case 'courseList':
        result.choiceList = item[key];
        break;
      case 'declaredSemester':
        result.declaredAcademicTerm = item[key];
        break;
      case 'number':
        result.num = item[key];
        break;
      case 'semester':
        result.academicTerm = item[key];
        break;
      case 'semesters':
        result.academicTerms = item[key];
        break;
      default:
        result[key] = item[key];
    }
  }
  // console.log(result);
  return result;
};

const fixRelativeLinks = (description: string): string => {
  let fixed = description.replace(/..\/courses/gi, '/explorer/courses');
  fixed = fixed.replace(/..\/opportunities/gi, '/explorer/opportunities');
  fixed = fixed.replace(/data-scientist/g, '/explorer/career-goals/data-scientist');
  fixed = fixed.replace(/graduate-school/g, '/explorer/career-goals/graduate-school');
  fixed = fixed.replace(/mobile-app-developer/g, '/explorer/career-goals/mobile-app-developer');
  fixed = fixed.replace(/game-developer/g, '/explorer/career-goals/game-developer');
  fixed = fixed.replace(/full-stack-developer/g, '/explorer/career-goals/full-stack-developer');
  fixed = fixed.replace(/vr-ar-engineer/g, '/explorer/career-goals/vr-ar-engineer');
  fixed = fixed.replace(/hhttp/g, 'http');
  fixed = fixed.replace(/ics(\d{3})/g, 'ics_' + '$1'); // eslint-disable-line no-useless-concat
  return fixed;
};

const convertCareerGoal = (goal) => {
  const result: any = {};
  for (const key in goal) { // eslint-disable-line no-restricted-syntax
    if (key === 'description') {
      result.description = fixRelativeLinks(goal.description);
    } else {
      result[key] = goal[key];
    }
  }
  return result;
};

const convertProfile = (profile, data) => {
  const result: any = {};
  for (const key in profile) { // eslint-disable-line no-restricted-syntax
    if (key === 'picture') {
      result.picture = profile.picture.replace(/http:\/\/res.cloudinary.com/g, 'https://res.cloudinary.com');
    } else if (key === 'interests') {
      let interests = profile.interests;
      const careerGoalCollection = getCollectionData(data, 'CareerGoalCollection');
      const favoriteCareerGoalCollection = getCollectionData(data, 'FavoriteCareerGoalCollection');
      const profileFavoriteCareerGoals = _.filter(favoriteCareerGoalCollection, (entry) => entry.username === profile.username);
      const profileCareerGoalSlugs = profileFavoriteCareerGoals.map((fav) => fav.careerGoal);
      const profileCareerGoals = profileCareerGoalSlugs.map((slug) => getCollectionDocFromSlug(careerGoalCollection, slug));
      profileCareerGoals.forEach((careerGoal) => {
        interests = _.union(interests, careerGoal.interests);
      });
      result[key] = _.uniq(interests);
    } else {
      result[key] = profile[key];
    }
  }
  return result;
};

const processRadGradCollection = (collection: ICollection) => {
  const result: any = {};
  // console.log(collection.name, collection.contents);
  if (collection.name === 'SemesterCollection') {
    result.name = 'AcademicTermCollection';
    result.contents = collection.contents;
    // console.log(result);
  } else if (collection.name === 'CareerGoalCollection') {
    result.name = collection.name;
    result.contents = _.map(collection.contents, convertCareerGoal);
  } else if (collection.name === 'StudentProfileCollection' || collection.name === 'AdvisorProfileCollection' || collection.name === 'FacultyProfileCollection') {
    result.name = collection.name;
    result.contents = _.map(collection.contents, (profile) => convertProfile(profile, radGrad1DataDump));
  } else {
    result.name = collection.name;
    result.contents = _.map(collection.contents, convertObject);
  }
  // console.log(result.name, result.contents);
  return result;
};

const reinitializedCollections = ['FavoriteCareerGoalCollection',
  'FavoriteInterestCollection'];

const addedCollections = ['AdminProfileCollection', 'PageInterestCollection', 'PageInterestsDailySnapshotCollection', 'UserInteractionCollection'].concat(reinitializedCollections);

const addMissingCollections = (result) => {
  addedCollections.forEach(collectionName => {
    if (!(result.collections.find(entry => entry.name === collectionName))) {
      const coll: any = {};
      coll.name = collectionName;
      coll.contents = [];
      result.collections.push(coll);
    }
  });
};

const deletedCollections = ['DesiredDegreeCollection', 'MentorAnswerCollection', 'MentorProfileCollection', 'MentorQuestionCollection', 'UserInteractionCollection', 'AcademicPlanCollection',
  'FavoriteAcademicPlanCollection', 'PlanChoiceCollection', 'AdvisorLogCollection', 'HelpMessageCollection', 'PageInterestCollection', 'PageInterestsDailySnapshotCollection'].concat(reinitializedCollections);

const processRadGradCollections = (data: IDataDump) => {
  const result: any = {};
  result.timestamp = moment().format(databaseFileDateFormat);
  result.collections = [];
  _.forEach(data.collections, (c) => {
    if (!deletedCollections.includes(c.name)) {
      result.collections.push(processRadGradCollection(c));
    }
  });
  addMissingCollections(result);
  return result;
};

const compareEntries = (entry1, entry2) => {
  if (entry1.name < entry2.name) {
    return -1;
  }
  if (entry1.name > entry2.name) {
    return 1;
  }
  return 0;
};

async function convertDump(radgrad1DumpFile, outFileName) {
  const data = fs.readFileSync(radgrad1DumpFile);
  radGrad1DataDump = JSON.parse(data.toString());
  const radgrad2 = processRadGradCollections(radGrad1DataDump);
  const data2 = JSON.stringify(radgrad2, null, 2);
  radgrad2.collections.sort((entry1, entry2) => compareEntries(entry1, entry2));
  radgrad2.collections.forEach(entry => console.log(entry.name, entry.contents.length));
  fs.writeFileSync(outFileName, data2);
  console.log(`Convert Dump: ${radgrad1DumpFile} --> ${outFileName}`);
}

program
  .arguments('<radgrad1DumpFile> <outFileName>')
  .description('Parse a RadGrad1 dump file and create a new one in RadGrad2 format.', {
    radgrad1DumpFile: 'A pre-existing RadGrad1 database dump file',
    outFileName: 'The name of the RadGrad2 database dump file to be created',
  })
  .action((radgrad1DumpFile, outFileName) => convertDump(radgrad1DumpFile, outFileName));

program.parse(process.argv);
