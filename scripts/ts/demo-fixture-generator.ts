import { program } from 'commander';
import * as fs from 'fs';
import { getCollectionData } from './data-dump-utils';

async function generateDemoFixture(radgradDumpFile, userConfigFile) {
  console.log('generateDemoFixture', radgradDumpFile, userConfigFile);
  const data = fs.readFileSync(radgradDumpFile);
  const radgradDump = JSON.parse(data.toString());
  const careerGoals = getCollectionData(radgradDump, 'CareerGoalCollection');
  const courses = getCollectionData(radgradDump, 'CourseCollection');
  const interests = getCollectionData(radgradDump, 'InterestCollection');
  const oppotunities = getCollectionData(radgradDump, 'OpportunityCollection');
  console.log(careerGoals.length, courses.length, interests.length, oppotunities.length);
}

program
  .arguments('<radgradDumpFile> <userConfigFile>')
  .description('Creates a demo fixture file based upon the RadGrad dump file and a user config file.', {
    radgradDumpFile: 'A pre-existing RadGrad2 database dump file',
    userConfigFile: 'A pre-existing user configuration file',
  })
  .action((radgradDumpFile, userConfigFile) => generateDemoFixture(radgradDumpFile, userConfigFile));

program.parse(process.argv);
