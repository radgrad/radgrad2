import * as fs from 'fs';
// import * as inquirer from 'inquirer';
import * as _ from 'lodash';
import * as moment from 'moment';

interface ICollection {
  name: string;
  contents: any[];
}

interface IDataDump {
  timestamp: string;
  collections: ICollection[];
}

const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

const convertHelpRouteName = (name: string): string => {
  switch (name) {
    case 'Advisor_Student_Configuration_Page':
      return '/advisor/:username/home';
    case 'Advisor_Verification_Requests_Pending_Page':
      return '/advisor/:username/verification-requests';
    case 'Advisor_Event_Verification_Page':
      return '/advisor/:username/event-verification';
    case 'Advisor_Completed_Verifications_Page':
      return '/advisor/:username/completed-verifications';
    case 'Advisor_Academic_Plan_Page':
      return '/advisor/:username/academic-plan';
    case 'Advisor_Moderation_Page':
      return '/advisor/:username/moderation';
    case 'Faculty_Home_Page':
      return '/faculty/:username/home';
    case 'Faculty_Manage_Opportunities_Page':
      return '/faculty/:username/manage-opportunities';
    case 'Faculty_Explorer_Page':
      return '/faculty/:username/explorer';
    case 'Faculty_Explorer_CareerGoals_Page':
      return '/faculty/:username/explorer/career-goals';
    case 'Faculty_Explorer_Courses_Page':
      return '/faculty/:username/explorer/courses';
    case 'Faculty_Explorer_Plans_Page':
      return '/faculty/:username/explorer/academic-plans';
    case 'Faculty_Explorer_Interests_Page':
      return '/faculty/:username/explorer/interests';
    case 'Faculty_Explorer_Opportunities_Page':
      return '/faculty/:username/explorer/opportunities';
    case 'Faculty_Explorer_Users_Page':
      return '/faculty/:username/explorer/users';
    case 'Faculty_Verification_Page':
      return '/faculty/:username/verification-requests';
    case 'Mentor_Home_Page':
      return '/mentor/:username/home';
    case 'Mentor_Explorer_Page':
      return '/mentor/:username/explorer';
    case 'Mentor_Explorer_CareerGoals_Page':
      return '/mentor/:username/explorer/career-goals';
    case 'Mentor_Explorer_Courses_Page':
      return '/mentor/:username/explorer/courses';
    case 'Mentor_Explorer_Plans_Page':
      return '/mentor/:username/explorer/academic-plans';
    case 'Mentor_Explorer_Interests_Page':
      return '/mentor/:username/explorer/interests';
    case 'Mentor_Explorer_Opportunities_Page':
      return '/mentor/:username/explorer/opportunities';
    case 'Mentor_Explorer_Users_Page':
      return '/mentor/:username/explorer/users';
    case 'Mentor_MentorSpace_Page':
      return '/mentor/:username/mentor-space';
    case 'Student_Home_Page':
      return '/student/:username/home';
    case 'Student_Degree_Planner_Page':
      return '/student/:username/degree-planner';
    case 'Student_Home_AboutMe_Page':
      return '/student/:username/home/about-me';
    case 'Student_Home_Ice_Page':
      return '/student/:username/home/ice';
    case 'Student_Home_Levels_Page':
      return '/student/:username/home/levels';
    case 'Student_Ice':
      return '/student/:username/ice';
    case 'Student_Explorer_Page':
      return '/student/:username/explorer';
    case 'Student_MentorSpace_Page':
      return '/student/:username/mentor-space';
    case 'Student_Home_Log_Page':
      return '/student/:username/home/log';
    case 'Student_Explorer_CareerGoals_Page':
      return '/student/:username/explorer/career-goals';
    case 'Student_Explorer_Courses_Page':
      return '/student/:username/explorer/courses';
    case 'Student_Explorer_Plans_Page':
      return '/student/:username/explorer/academic-plans';
    case 'Student_Explorer_Interests_Page':
      return '/student/:username/explorer/interests';
    case 'Student_Explorer_Opportunities_Page':
      return '/student/:username/explorer/opportunities';
    case 'Student_Explorer_Users_Page':
      return '/student/:username/explorer/users';
    default:
      return name;
  }
};

const convertObject = (item) => {
  const result: any = {};
  for (const key in item) { // eslint-disable-line
    // console.log(key);
    switch (key) {
      case 'coursesPerSemester':
        result.coursePerAcademicTerm = item[key];
        break;
      case 'declaredSemester':
        result.declaredAcademicTerm = item[key];
        break;
      case 'number':
        result.num = item[key];
        break;
      case 'routeName':
        result[key] = convertHelpRouteName(item[key]);
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

function processRadGradCollection(collection: ICollection) {
  const result: any = {};
  // console.log(collection.name, collection.contents);
  if (collection.name === 'SemesterCollection') {
    result.name = 'AcademicTermCollection';
    result.contents = collection.contents;
    // console.log(result);
  } else {
    result.name = collection.name;
    result.contents = _.map(collection.contents, convertObject);
  }
  // console.log(result.name, result.contents);
  return result;
}

function processRadGradCollections(data: IDataDump) {
  const result: any = {};
  result.timestamp = moment().format(databaseFileDateFormat);
  result.collections = [];
  _.forEach(data.collections, (c) => result.collections.push(processRadGradCollection(c)));
  return result;
}


async function convertRadGrad1DatabaseDumpToRadGrad2() {
  const argv = process.argv;
  if (argv.length < 3) {
    console.error('Usage: node dist/convert <fileName>');
  } else {
    const filename = argv[2];
    // console.log(userParams.radgrad1);
    const data = fs.readFileSync(filename);
    const radgrad1: IDataDump = JSON.parse(data.toString());
    // console.log(radgrad1);
    const radgrad2 = processRadGradCollections(radgrad1);
    const data2 = JSON.stringify(radgrad2, null, 2);
    fs.writeFileSync(`RadGrad2-${filename}`, data2);
  }
}

/**
 * Run the conversion.
 */
convertRadGrad1DatabaseDumpToRadGrad2();
