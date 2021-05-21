import { program } from 'commander';
import * as fs from 'fs';
import { getCollectionData, getCollectionSlugs, getNonRetiredCollectionData } from '../data-dump-utils';
import { getCurrentTerm, isQuarterSystem, nextAcademicTerm, prevAcademicTerm, prevNonSummerTerm } from './academic-term-utilities';
import AcademicTermCollection from './AcademicTermCollection';
import { generateCourseInstance } from './course-instance-utilities';
import RadGradCollection from './RadGradCollection';
import { StudentConfig } from './user-config-file.js';

async function generateDemoFixture(radgradDumpFile, userConfigFile) {
  console.log('generateDemoFixture', radgradDumpFile, userConfigFile);
  const data = fs.readFileSync(radgradDumpFile);
  const radgradDump = JSON.parse(data.toString());
  const academicTerms = new AcademicTermCollection(getCollectionData(radgradDump, 'AcademicTermCollection'));
  const careerGoals = getCollectionData(radgradDump, 'CareerGoalCollection');
  const courses = getCollectionData(radgradDump, 'CourseCollection');
  const nonRetiredCourses = getNonRetiredCollectionData(radgradDump, 'CourseCollection');
  const interestCollection = new RadGradCollection('InterestsCollection', getNonRetiredCollectionData(radgradDump, 'InterestCollection'));
  console.log(interestCollection.getRandomSlugs(3));
  const interests = getCollectionData(radgradDump, 'InterestCollection');
  const interestSlugs = getCollectionSlugs(interests);
  const opportunities = getCollectionData(radgradDump, 'OpportunityCollection');
  const nonRetiredOpportunities = getNonRetiredCollectionData(radgradDump, 'OpportunityCollection');
  const faculty = getNonRetiredCollectionData(radgradDump, 'FacultyProfileCollection');
  console.log(faculty.length);
  console.log(careerGoals.length, interests.length, interestSlugs.length);
  console.log(courses.length, nonRetiredCourses.length);
  console.log(opportunities.length, nonRetiredOpportunities.length);
  const quarters = academicTerms.isQuarterSystem();
  const currentTerm = academicTerms.getCurrentTerm();
  const nextTerm = academicTerms.nextAcademicTerm(currentTerm);
  console.log(currentTerm, nextTerm, academicTerms.nextAcademicTerm(nextTerm));
  console.log(nextTerm, prevAcademicTerm(nextTerm, quarters), prevNonSummerTerm(nextTerm, quarters));
  const configData = fs.readFileSync(userConfigFile);
  const userConfig: StudentConfig = JSON.parse(configData.toString());
  userConfig.studentPlans.map((plan) => {
    const student = plan.username;
    plan.courses.map((c) => {
      console.log(generateCourseInstance(student, c, currentTerm, quarters));
      return true;
    });
    return true;
  });
}

program
  .arguments('<radgradDumpFile> <userConfigFile>')
  .description('Creates a demo fixture file based upon the RadGrad dump file and a user config file.', {
    radgradDumpFile: 'A pre-existing RadGrad2 database dump file',
    userConfigFile: 'A pre-existing user configuration file',
  })
  .action((radgradDumpFile, userConfigFile) => generateDemoFixture(radgradDumpFile, userConfigFile));

program.parse(process.argv);
