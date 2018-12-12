import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicYearInstances } from './AcademicYearInstanceCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';

/**
 * Returns the student's current academicTerm number (i.e. which academicTerm are they currently in.)
 * @param studentID the studentID.
 * @returns {number}
 * @memberOf api/degree-plan
 */
export function getStudentsCurrentAcademicTermNumber(studentID: string) {
  const cis = CourseInstances.find({ studentID }).fetch();
  let firstSemester;
  _.forEach(cis, (ci) => {
    const academicTerm = AcademicTerms.findDoc(ci.termID);
    if (!firstSemester) {
      firstSemester = academicTerm;
    } else if (academicTerm.termNumber < firstSemester.termNumber) {
      firstSemester = academicTerm;
    }
  });
  const currentSemester = AcademicTerms.getCurrentAcademicTermDoc();
  return (currentSemester.termNumber - firstSemester.termNumber) + 1;
}

/**
 * Returns an array of the academicTermIDs that the student has taken or is planning to take courses or opportunities
 * in.
 * @param studentID the studentID.
 * @memberOf api/degree-plan
 */
export function getStudentTerms(studentID: string) {
  const years = AcademicYearInstances.find({ studentID }, { $sort: { year: 1 } }).fetch();
  let academicTerms = [];
  _.forEach(years, (ay) => {
    academicTerms = _.concat(academicTerms, ay.termIDs);
  });
  const cis = CourseInstances.find({ studentID }).fetch();
  let courseSemesters = [];
  _.forEach(cis, (ci) => {
    courseSemesters.push(ci.termID);
  });
  courseSemesters = _.uniq(courseSemesters);
  return academicTerms;
}
