import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicYearInstances } from './AcademicYearInstanceCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { AcademicTerms } from '../semester/AcademicTermCollection';

/**
 * Returns the student's current semester number (i.e. which semester are they currently in.)
 * @param studentID the studentID.
 * @returns {number}
 * @memberOf api/degree-plan
 */
export function getStudentsCurrentSemesterNumber(studentID: string) {
  const cis = CourseInstances.find({ studentID }).fetch();
  let firstSemester;
  _.forEach(cis, (ci) => {
    const semester = AcademicTerms.findDoc(ci.termID);
    if (!firstSemester) {
      firstSemester = semester;
    } else if (semester.semesterNumber < firstSemester.semesterNumber) {
      firstSemester = semester;
    }
  });
  const currentSemester = AcademicTerms.getCurrentSemesterDoc();
  return (currentSemester.semesterNumber - firstSemester.semesterNumber) + 1;
}

/**
 * Returns an array of the academicTermIDs that the student has taken or is planning to take courses or opportunities
 * in.
 * @param studentID the studentID.
 * @memberOf api/degree-plan
 */
export function getStudentTerms(studentID: string) {
  const years = AcademicYearInstances.find({ studentID }, { $sort: { year: 1 } }).fetch();
  let semesters = [];
  _.forEach(years, (ay) => {
    semesters = _.concat(semesters, ay.termIDs);
  });
  const cis = CourseInstances.find({ studentID }).fetch();
  let courseSemesters = [];
  _.forEach(cis, (ci) => {
    courseSemesters.push(ci.termID);
  });
  courseSemesters = _.uniq(courseSemesters);
  return semesters;
}
