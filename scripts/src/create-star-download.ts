import * as fs from 'fs';
import * as _ from 'lodash';
import * as moment from 'moment';

export const initDataDump = () => {
  const { argv } = process;
  // console.log(argv);
  if (argv.length < 3) {
    console.error('Usage: node dist/create-star-downloads.js <fileName>');
    return undefined;
  }
  const filename = argv[2];
  const data = fs.readFileSync(filename);
  return JSON.parse(data.toString());
};

const getCollectionData = (radgradDump, collectionName) => _.find(radgradDump.collections, (c) => c.name === collectionName).contents;

const getCourseInstances = (radgradDump) => getCollectionData(radgradDump, 'CourseInstanceCollection');

const radgradDump = initDataDump();
console.log(getCourseInstances(radgradDump).length);
