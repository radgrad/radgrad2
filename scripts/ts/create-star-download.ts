import * as fs from 'fs';
import * as _ from 'lodash';
import * as faker from 'faker';
import { program } from 'commander';

interface IStarCourseData {
  attributes: string[];
  attributeChecks: boolean[];
  areas: string[] | object[];
  key: number;
  semesterKey: string;
  semester: string;
  description: string;
  name: string;
  number: string;
  credits: string;
  grade: string;
  level: string;
  crn: string;
  gradeMode: string;
  repeats: string;
  com: string;
  banCom: string;
  transferInstitution: string;
  transferName: string;
  transferNumber: string;
  accept: string;
  transferDescription: string;
  transferCredits: string;
  transferGrade: string;
  transfer: boolean;
  attemptedCredits: number;
  instructor: string;
  earnedCredits: number;
  gprCredits: number;
  qualityPoints: number;
  college: string;
}

interface IStudentStarData {
  courses: IStarCourseData[];
  name: {
    first: string;
    last: string;
  };
  email: string;
  declaredMajor: {
    first: string;
    second: string;
  }
}

const makeStarCourseData = (academicTermSlug, courseSlug, grade): IStarCourseData => {
  const semester = academicTermSlug.replace('-', ' ');
  const name = courseSlug.split('_')[0].toUpperCase();
  const num = courseSlug.split('_')[1];
  const courseNum = parseInt(num, 10);
  const level = (courseNum > 500 ? 'GR' : 'UG');
  const description = faker.lorem.sentences();
  const retVal: IStarCourseData = {
    attributes: [
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      'DP',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
    ],
    attributeChecks: [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
    areas: [
      null,
      null,
      null,
      null,
      null,
    ],
    key: 3282107,
    semesterKey: '201730',
    semester,
    description,
    name,
    number: num,
    credits: '3',
    grade,
    level,
    crn: ' ',
    gradeMode: ' ',
    repeats: ' ',
    com: '                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    ',
    banCom: 'X',
    transferInstitution: ' ',
    transferName: ' ',
    transferNumber: ' ',
    accept: 'O',
    transferDescription: ' ',
    transferCredits: ' ',
    transferGrade: ' ',
    transfer: false,
    attemptedCredits: 0,
    instructor: 'unknown',
    earnedCredits: 0,
    gprCredits: 0,
    qualityPoints: 0,
    college: ' ',
  };
  return retVal;
};
const makeStudentStarData = (studentProfile): IStudentStarData => {
  const retVal: IStudentStarData = {
    courses: [],
    name: {
      first: studentProfile.firstName,
      last: studentProfile.lastName,
    },
    email: studentProfile.username,
    declaredMajor: {
      first: ' ',
      second: ' ',
    },
  };
  return retVal;
};

// export const initDataDump = () => {
//   const {argv} = process;
//   // console.log(argv);
//   if (argv.length < 3) {
//     console.error('Usage: node dist/create-star-downloads.js <fileName>');
//     return undefined;
//   }
//   const filename = argv[2];
//   const data = fs.readFileSync(filename);
//   return JSON.parse(data.toString());
// };

const getCollectionData = (radgradDump, collectionName) => _.find(radgradDump.collections, (c) => c.name === collectionName).contents;

const getStudentProfiles = (radgradDump) => getCollectionData(radgradDump, 'StudentProfileCollection');
const getCourseInstances = (radgradDump) => getCollectionData(radgradDump, 'CourseInstanceCollection');
const getStudentCourseInstances = (radgradDump, student) => {
  const courseInstances = getCourseInstances(radgradDump);
  return _.filter(courseInstances, (ci) => ci.student === student.username);
};

const buildStarData = (starDataFile) => {
  const data = fs.readFileSync(starDataFile);
  const radgradDump = JSON.parse(data.toString());
  const profiles = getStudentProfiles(radgradDump);
  const retVal = [];
  _.forEach(profiles, (p) => {
    const studentData = makeStudentStarData(p);
    const studentInstances = getStudentCourseInstances(radgradDump, p);
    // console.log(p.username, studentInstances.length);
    _.forEach(studentInstances, (cis) => {
      if (cis.fromRegistrar) {
        studentData.courses.push(makeStarCourseData(cis.academicTerm, cis.course, cis.grade));
      }
    });
    retVal.push(studentData);
  });
  return retVal;
};

program
  .arguments('<starDataFile>')
  .description('Parse a STAR data file and output a JSON string with RadGrad student and courseInstance data.', {
    starDataFile: 'A file containing STAR data produced by the download-bulk-start-json script.',
  })
  .action((starDataFile) => {
    const starData = buildStarData(starDataFile);
    console.log(JSON.stringify(starData, null, 2));
  });

program.parse(process.argv);
