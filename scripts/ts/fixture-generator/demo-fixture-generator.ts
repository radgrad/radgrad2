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
import { generateReview } from './review-utilities';

interface Doc {
  slug?: string;
  term?: string;
  targetSlug?: string;
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

const buildReviewsCollection = (studentConfig: StudentConfig, academicTerms: AcademicTermCollection, opportunities: RadGradCollection): ICollection => {
  const result = {
    name: RadGradCollectionName.REVIEWS,
    contents: [],
  };
  const currentTerm = academicTerms.getCurrentTerm();
  const quarters = academicTerms.isQuarterSystem();
  studentConfig.studentPlans.forEach((plan) => {
    const student = plan.username;
    plan.reviews.forEach((p) => {
      result.contents.push(generateReview(student, p, currentTerm, quarters, opportunities));
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

const buildStudentProfileCollection = (studentConfig: StudentConfig): ICollection => {
  const result = {
    name: RadGradCollectionName.STUDENT_PROFILES,
    contents: [],
  };
  studentConfig.studentProfiles.contents.forEach((profile) => {
    result.contents.push(profile);
  });
  return result;
};

const validateCareerGoalsAndInterests = () => {};

const validateFixture = (radgradDump: IDataDump) => {
  const courses = new RadGradCollection(RadGradCollectionName.COURSES, getCollectionData(radgradDump, RadGradCollectionName.COURSES));
  const opportunities = new RadGradCollection(RadGradCollectionName.OPPORTUNITIES, getCollectionData(radgradDump, RadGradCollectionName.OPPORTUNITIES));
  const careerGoals = new RadGradCollection(RadGradCollectionName.CAREER_GOALS, getCollectionData(radgradDump, RadGradCollectionName.CAREER_GOALS));
  const interests = new RadGradCollection(RadGradCollectionName.INTERESTS, getCollectionData(radgradDump, RadGradCollectionName.INTERESTS));
  const teasers = new RadGradCollection(RadGradCollectionName.TEASERS, getCollectionData(radgradDump, RadGradCollectionName.TEASERS));
  const teaserSlugs = teasers.getContents().map((teaser) => teaser.targetSlug);
  teaserSlugs.forEach((slug) => {
    if (!(courses.isDefinedSlug(slug) || opportunities.isDefinedSlug(slug) || careerGoals.isDefinedSlug(slug) || interests.isDefinedSlug(slug))) {
      throw new Error(`Teaser target ${slug} is not a defined career goal, course, interest, or opportunity`);
    }
  });
  const students = new RadGradCollection(RadGradCollectionName.STUDENT_PROFILES, getCollectionData(radgradDump, RadGradCollectionName.STUDENT_PROFILES));
  students.getContents().forEach((profile) => {
    validateCareerGoalsAndInterests(profile, interests, careerGoals);
  });
};

const createFixture = (radgradDump: IDataDump, studentConfig: StudentConfig, academicTerms: AcademicTermCollection): IDataDump => {
  const result: IDataDump = {
    timestamp: `${moment().format(databaseFileDateFormat)}`,
    collections: [],
  };
  radgradDump.collections.forEach((coll) => {
    // @ts-ignore
    if (copyCollectionNames.includes(coll.name)) {
      // eslint-disable-next-line no-param-reassign
      coll.contents = coll.contents.filter((doc) => !doc.retired); // We don't want retired items.
      result.collections.push(coll);
    }
  });
  // Validate the slugs
  validateFixture(result);
  // Build the course instance collection
  const ciCollection: ICollection = buildCourseInstanceCollection(studentConfig, academicTerms);
  result.collections.push(ciCollection);
  const studentProfileCollection: ICollection = buildStudentProfileCollection(studentConfig);
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
  const opportunities = new RadGradCollection(RadGradCollectionName.OPPORTUNITIES, getNonRetiredCollectionData(radgradDump, RadGradCollectionName.OPPORTUNITIES));
  result.collections.push(buildReviewsCollection(studentConfig, academicTerms, opportunities));
  // sort the collections
  result.collections.sort((entry1, entry2) => compareCollections(entry1, entry2));
  validateFixture(result);
  return result;
};

async function generateDemoFixture(radgradDumpFile, userConfigFile) {
  console.log('generateDemoFixture', radgradDumpFile, userConfigFile);
  const fixtureFileName = `data/${moment().format(databaseFileDateFormat)}.json`;
  console.log(fixtureFileName);
  const data = fs.readFileSync(radgradDumpFile);
  const radgradDump = JSON.parse(data.toString());
  const academicTerms = new AcademicTermCollection(getCollectionData(radgradDump, RadGradCollectionName.ACADEMIC_TERMS));
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
