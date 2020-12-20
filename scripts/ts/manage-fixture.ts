import * as fs from 'fs';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as faker from 'faker';

const initDataDump = () => {
  const { argv } = process;
  // console.log(argv);
  if (argv.length < 3) {
    console.error('Usage: node ./dist/manage-fixture.js <fileName>');
    return undefined;
  }
  const filename = argv[2];
  const data = fs.readFileSync(filename);
  return JSON.parse(data.toString());
};

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
const fixtureData = initDataDump();

console.log(getAcademicYearRange(fixtureData));
