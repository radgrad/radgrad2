import { program } from 'commander';
import * as fs from 'fs';
import moment from 'moment';
import _ from 'lodash';
import { getCollectionData, getNonRetiredCollectionData } from '../data-dump-utils';
import AcademicTermCollection from './AcademicTermCollection';
import { generateCourseInstance } from './course-instance-utilities';
import { generateOpportunityInstance } from './opportunity-instance-utilities';
import RadGradCollection, { RadGradCollectionName } from './RadGradCollection';
import { StudentConfig } from './user-config-file.js';

interface Doc {
  slug?: string;
  term?: string;
  retired?: boolean;
}

interface ICollection {
  name: string;
  contents: Doc[];
}

interface IDataDump {
  timestamp: string;
  collections: ICollection[];
}

const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';
const copyCollectionNames = [RadGradCollectionName.ACADEMIC_TERMS, RadGradCollectionName.ADMIN_PROFILES, RadGradCollectionName.ADVISOR_PROFILES, RadGradCollectionName.CAREER_GOALS, RadGradCollectionName.COURSES, RadGradCollectionName.FACULTY_PROFILES, RadGradCollectionName.INTERESTS, RadGradCollectionName.INTEREST_TYPES, RadGradCollectionName.OPPORTUNITIES, RadGradCollectionName.OPPORTUNITY_TYPES, RadGradCollectionName.TEASERS];

const buildCourseInstanceCollection = (studentConfig: StudentConfig, academicTerms: AcademicTermCollection): ICollection => {
  const result = {
    name: RadGradCollectionName.COURSE_INSTANCES,
    contents: [],
  };
  const currentTerm = academicTerms.getCurrentTerm();
  const quarters = academicTerms.isQuarterSystem();
  studentConfig.studentPlans.forEach((plan) => {
    const student = plan.username;
    plan.courses.forEach((p) => {
      result.contents.push(generateCourseInstance(student, p, currentTerm, quarters));
    });
  });
  return result;
};

const buildOpportunityInstanceCollection = (studentConfig: StudentConfig, academicTerms: AcademicTermCollection): ICollection => {
  const result = {
    name: RadGradCollectionName.OPPORTUNITY_INSTANCES,
    contents: [],
  };
  const currentTerm = academicTerms.getCurrentTerm();
  const quarters = academicTerms.isQuarterSystem();
  studentConfig.studentPlans.forEach((plan) => {
    const student = plan.username;
    plan.opportunities.forEach((p) => {
      result.contents.push(generateOpportunityInstance(student, p, currentTerm, quarters));
    });
  });
  return result;
};

const compareCollections = (entry1, entry2) => {
  if (entry1.name < entry2.name) {
    return -1;
  }
  if (entry1.name > entry2.name) {
    return 1;
  }
  return 0;
};

const buildStudentProfileCollection = (studentConfig: StudentConfig, academicTerms, interests, careerGoals): ICollection => {
  const result = {
    name: RadGradCollectionName.STUDENT_PROFILES,
    contents: [],
  };
  studentConfig.studentProfiles.contents.forEach((profile) => {
    const randCareerGoals = careerGoals.getRandomSlugs(Math.floor(Math.random() * 3));
    randCareerGoals.forEach((goal) => {
      // @ts-ignore
      profile.careerGoals.push(goal);
      const doc = careerGoals.getDocBySlug(goal);
      // @ts-ignore
      doc?.interests.forEach((i) => profile.interests.push(i));
    });
    const randInterests = interests.getRandomSlugs(Math.floor(Math.random() * 2));
    // @ts-ignore
    randInterests.forEach((i) => profile.interests.push(i));
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    profile.interests = _.uniq(profile.interests);
    result.contents.push(profile);
  });
  return result;
};

const createFixture = (radgradDump: IDataDump, studentConfig: StudentConfig, academicTerms: AcademicTermCollection): IDataDump => {
  const result: IDataDump = {
    timestamp: `${moment().format(databaseFileDateFormat)}`,
    collections: [],
  };
  radgradDump.collections.forEach((coll) => {
    // @ts-ignore
    if (copyCollectionNames.includes(coll.name)) {
      result.collections.push(coll); // Do we want retired items?
    }
  });
  // Build the course instance collection
  const ciCollection: ICollection = buildCourseInstanceCollection(studentConfig, academicTerms);
  result.collections.push(ciCollection);
  const interests = new RadGradCollection(RadGradCollectionName.INTERESTS, getNonRetiredCollectionData(radgradDump, RadGradCollectionName.INTERESTS));
  const careerGoals = new RadGradCollection(RadGradCollectionName.CAREER_GOALS, getNonRetiredCollectionData(radgradDump, RadGradCollectionName.CAREER_GOALS));
  const studentProfileCollection: ICollection = buildStudentProfileCollection(studentConfig, academicTerms, interests, careerGoals);
  result.collections.push(studentProfileCollection);
  const oiCollection: ICollection = buildOpportunityInstanceCollection(studentConfig, academicTerms);
  result.collections.push(oiCollection);
  // Empty collections so we can load. Will fill in later
  result.collections.push({
    name: RadGradCollectionName.PROFILE_CAREER_GOALS,
    contents: [],
  });
  result.collections.push({
    name: RadGradCollectionName.PROFILE_COURSES,
    contents: [],
  });
  result.collections.push({
    name: RadGradCollectionName.PROFILE_INTERESTS,
    contents: [],
  });
  result.collections.push({
    name: RadGradCollectionName.PROFILE_OPPORTUNITIES,
    contents: [],
  });
  result.collections.push({
    name: RadGradCollectionName.VERIFICATION_REQUESTS,
    contents: [],
  });
  result.collections.push({
    name: RadGradCollectionName.USER_INTERACTIONS,
    contents: [],
  });
  result.collections.push({
    name: RadGradCollectionName.REVIEWS,
    contents: [],
  });
  // sort the collections
  result.collections.sort((entry1, entry2) => compareCollections(entry1, entry2));
  return result;
};

async function generateDemoFixture(radgradDumpFile, userConfigFile) {
  console.log('generateDemoFixture', radgradDumpFile, userConfigFile);
  const fixtureFileName = `data/${moment().format(databaseFileDateFormat)}.json`;
  console.log(fixtureFileName);
  const data = fs.readFileSync(radgradDumpFile);
  const radgradDump = JSON.parse(data.toString());
  const academicTerms = new AcademicTermCollection(getCollectionData(radgradDump, RadGradCollectionName.ACADEMIC_TERMS));
  // const opportunities = new RadGradCollection(RadGradCollectionName.OPPORTUNITIES, getNonRetiredCollectionData(radgradDump, RadGradCollectionName.OPPORTUNITIES));
  // console.log(opportunities.getRandomSlugs(10));
  const configData = fs.readFileSync(userConfigFile);
  const userConfig: StudentConfig = JSON.parse(configData.toString());
  const fixture = createFixture(radgradDump, userConfig, academicTerms);
  const fixtureString = JSON.stringify(fixture, null, 2);
  fs.writeFileSync(fixtureFileName, fixtureString);
}

program
  .arguments('<radgradDumpFile> <userConfigFile>')
  .description('Creates a demo fixture file based upon the RadGrad dump file and a user config file.', {
    radgradDumpFile: 'A pre-existing RadGrad2 database dump file',
    userConfigFile: 'A pre-existing user configuration file',
  })
  .action((radgradDumpFile, userConfigFile) => generateDemoFixture(radgradDumpFile, userConfigFile));

program.parse(process.argv);
