import { program } from 'commander';
import * as fs from 'fs';
import { getCollectionData, getCollectionSlugs, getNonRetiredCollectionData } from '../data-dump-utils';
import { getCurrentTerm, isQuarterSystem, nextAcademicTerm, prevAcademicTerm, prevNonSummerTerm } from './academic-term-utilities';

async function generateDemoFixture(radgradDumpFile, userConfigFile) {
  console.log('generateDemoFixture', radgradDumpFile, userConfigFile);
  const data = fs.readFileSync(radgradDumpFile);
  const radgradDump = JSON.parse(data.toString());
  const academicTerms = getCollectionData(radgradDump, 'AcademicTermCollection');
  const careerGoals = getCollectionData(radgradDump, 'CareerGoalCollection');
  const courses = getCollectionData(radgradDump, 'CourseCollection');
  const nonRetiredCourses = getNonRetiredCollectionData(radgradDump, 'CourseCollection');
  const interests = getCollectionData(radgradDump, 'InterestCollection');
  const interestSlugs = getCollectionSlugs(interests);
  const opportunities = getCollectionData(radgradDump, 'OpportunityCollection');
  const nonRetiredOpportunities = getNonRetiredCollectionData(radgradDump, 'OpportunityCollection');
  const faculty = getNonRetiredCollectionData(radgradDump, 'FacultyProfileCollection');
  console.log(faculty);
  console.log(careerGoals.length, interests.length, interestSlugs.length);
  console.log(courses.length, nonRetiredCourses.length);
  console.log(opportunities.length, nonRetiredOpportunities.length);
  const quarters = isQuarterSystem(academicTerms);
  const currentTerm = getCurrentTerm(academicTerms);
  const nextTerm = nextAcademicTerm(currentTerm, quarters);
  console.log(currentTerm, nextTerm, nextAcademicTerm(nextTerm, quarters));
  console.log(nextTerm, prevAcademicTerm(nextTerm, quarters), prevNonSummerTerm(nextTerm, quarters));
}

program
  .arguments('<radgradDumpFile> <userConfigFile>')
  .description('Creates a demo fixture file based upon the RadGrad dump file and a user config file.', {
    radgradDumpFile: 'A pre-existing RadGrad2 database dump file',
    userConfigFile: 'A pre-existing user configuration file',
  })
  .action((radgradDumpFile, userConfigFile) => generateDemoFixture(radgradDumpFile, userConfigFile));

program.parse(process.argv);
