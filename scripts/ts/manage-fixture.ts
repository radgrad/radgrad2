import * as fs from 'fs';
import * as _ from 'lodash';
import { program } from 'commander';

const getCollectionData = (radgradDump, collectionName) => _.find(radgradDump.collections, (c) => c.name === collectionName).contents;

const academicTermYearRange = (collectionData, minYear, maxYear) => {
  _.forEach(collectionData, (doc) => {
    const termString = doc.academicTerm;
    const year = parseInt(termString.split('-')[1], 10);
    if (year < minYear) {
      // eslint-disable-next-line no-param-reassign
      minYear = year;
    }
    if (year > maxYear) {
      // eslint-disable-next-line no-param-reassign
      maxYear = year;
    }
  });
  return [minYear, maxYear];
};

const collectionNames = [
  'AcademicPlanCollection',
  'CourseInstanceCollection',
  'OpportunityInstanceCollection',
  'ReviewCollection',
  'VerificationRequestCollection',
];
const getAcademicYearRange = (fixtureData) => {
  let range = [2150, 1900];
  _.forEach(collectionNames, (name) => {
    console.log(name);
    const collectionData = getCollectionData(fixtureData, name);
    range = academicTermYearRange(collectionData, range[0], range[1]);
  });
  return range;
};

program
  .arguments('<fixtureFile>')
  .description('Extract the academic years referenced in a fixture file. Print results to console.', {
    fixtureFile: 'A file containing RadGrad1 data.',
  })
  .action((fixtureFile) => {
    const data = fs.readFileSync(fixtureFile);
    console.log(getAcademicYearRange(JSON.parse(data.toString())));
  });

program.parse(process.argv);
