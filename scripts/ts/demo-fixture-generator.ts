import { program } from 'commander';
import * as fs from 'fs';
import moment from 'moment';
import _ from 'lodash';
import { getCollectionData } from './data-dump-utils';

const isQuarterSystem = (academicTerms) => {
  const termNames = [];
  academicTerms.map((t) => termNames.push(t.term));
  const uniq = _.uniq(termNames);
  return uniq.length % 4 === 0;
};

const getCurrentTerm = (academicTerms) => {
  const isQuarter = isQuarterSystem(academicTerms);
  let fallStart;
  let springStart;
  let summerStart;
  if (isQuarter) {
    fallStart = parseInt(moment('09-26-2015', 'MM-DD-YYYY').format('DDD'), 10);
    springStart = parseInt(moment('04-01-2015', 'MM-DD-YYYY').format('DDD'), 10);
    summerStart = parseInt(moment('06-20-2015', 'MM-DD-YYYY').format('DDD'), 10);
  } else {
    fallStart = parseInt(moment('08-15-2015', 'MM-DD-YYYY').format('DDD'), 10);
    springStart = parseInt(moment('01-01-2015', 'MM-DD-YYYY').format('DDD'), 10);
    summerStart = parseInt(moment('05-15-2015', 'MM-DD-YYYY').format('DDD'), 10);
  }
  const year = moment().year();
  const day = moment().dayOfYear();
  let term = '';
  if (isQuarter) {
    if (day >= fallStart) {
      term = 'FALL';
    } else if (day >= summerStart) {
      term = 'SUMMER';
    } else if (day >= springStart) {
      term = 'SPRING';
    } else {
      term = 'WINTER';
    }
  } else if (day >= fallStart) {
    term = 'FALL';
  } else if (day >= summerStart) {
    term = 'SUMMER';
  } else {
    term = 'SPRING';
  }
  return `${term} ${year}`;
};

async function generateDemoFixture(radgradDumpFile, userConfigFile) {
  console.log('generateDemoFixture', radgradDumpFile, userConfigFile);
  const data = fs.readFileSync(radgradDumpFile);
  const radgradDump = JSON.parse(data.toString());
  const academicTerms = getCollectionData(radgradDump, 'AcademicTermCollection');
  const careerGoals = getCollectionData(radgradDump, 'CareerGoalCollection');
  const courses = getCollectionData(radgradDump, 'CourseCollection');
  const interests = getCollectionData(radgradDump, 'InterestCollection');
  const oppotunities = getCollectionData(radgradDump, 'OpportunityCollection');
  console.log(careerGoals.length, courses.length, interests.length, oppotunities.length);
  console.log(getCurrentTerm(academicTerms));
}

program
  .arguments('<radgradDumpFile> <userConfigFile>')
  .description('Creates a demo fixture file based upon the RadGrad dump file and a user config file.', {
    radgradDumpFile: 'A pre-existing RadGrad2 database dump file',
    userConfigFile: 'A pre-existing user configuration file',
  })
  .action((radgradDumpFile, userConfigFile) => generateDemoFixture(radgradDumpFile, userConfigFile));

program.parse(process.argv);
