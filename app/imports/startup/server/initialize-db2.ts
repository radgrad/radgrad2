import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
// import { loadCollection } from '../../api/test/test-utilities';
// import { Semesters } from '../../api/semester/SemesterCollection';
import { AcademicPlans } from '../../api/degree-plan/AcademicPlanCollection';

/**
 * The load/fixture file date format.
 * Used when dumping and restoring the RadGrad database.
 * @type {string}
 * @memberOf startup/server
 */
const loadFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

/**
 * Returns a string indicating how long ago the load file was created. Parses the file name string.
 * @param loadFileName The file name.
 * @returns { String } A string indicating how long ago the file was created.
 * @memberOf startup/server
 */
function getRestoreFileAge(loadFileName) {
  const terms = _.words(loadFileName, /[^/. ]+/g);
  const dateString = terms[terms.length - 2];
  return moment(dateString, loadFileDateFormat).fromNow();
}

function loadDatabase() {
  const loadFileName = Meteor.settings.public.databaseRestoreFileName;
  const loadFileAge = getRestoreFileAge(loadFileName);
  console.log(`Loading database from file ${loadFileName}, dumped ${loadFileAge}.`);
  const loadJSON = JSON.parse(Assets.getText(loadFileName));
  const plan = {
    slug: 'ba-ics-2015',
    degreeSlug: 'ba-ics',
    name: 'B.A. in Information and Computer Sciences (2015)',
    description: 'The general BA in ICS offers a firm foundation in computer science and allows students to apply computer science to an area of concentration.',
    semester: 'Fall-2015',
    coursesPerSemester: [
      2,
      2,
      0,
      2,
      2,
      0,
      2,
      2,
      0,
      1,
      1,
      0,
    ],
    courseList: [
      'ics_111-1',
      'ics_141-1',
      'ics_211-1',
      'ics_241-1',
      'ics_212-1',
      'ics_311-1',
      'ics_312,ics_331-1',
      'ics_321-1',
      'ics_313,ics_361-1',
      'ics_400+-1',
      'ics_332-1',
      'ics_400+-2',
      'ics_400+-3',
      'ics_400+-4',
    ],
  };
  // AcademicPlans.define(plan);
}

loadDatabase();
