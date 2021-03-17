import _ from 'lodash';
import { AcademicYearInstances } from './AcademicYearInstanceCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';

/**
 * Returns the student's current academicTerm number (i.e. which academicTerm are they currently in.)
 * @param studentID the studentID.
 * @returns {number}
 * @memberOf api/degree-plan
 */
export const getStudentsCurrentAcademicTermNumber = (studentID: string): number => {
  const cis = CourseInstances.find({ studentID }).fetch();
  let firstAcademicTerm;
  cis.forEach((ci) => {
    const academicTerm = AcademicTerms.findDoc(ci.termID);
    if (!firstAcademicTerm) {
      firstAcademicTerm = academicTerm;
    } else if (academicTerm.termNumber < firstAcademicTerm.termNumber) {
      firstAcademicTerm = academicTerm;
    }
  });
  const currentAcademicTerm = AcademicTerms.getCurrentAcademicTermDoc();
  return (currentAcademicTerm.termNumber - firstAcademicTerm.termNumber) + 1;
};

/**
 * Returns an array of the academicTermIDs that the student has taken or is planning to take courses or opportunities
 * in.
 * @param studentID the studentID.
 * @memberOf api/degree-plan
 */
export const getStudentTerms = (studentID: string): string[] => {
  const years = AcademicYearInstances.find({ studentID }, { $sort: { year: 1 } }).fetch();
  let academicTerms = [];
  years.forEach((ay) => {
    academicTerms = _.concat(academicTerms, ay.termIDs);
  });
  const cis = CourseInstances.find({ studentID }).fetch();
  let courseAcademicTerms = [];
  cis.forEach((ci) => {
    courseAcademicTerms.push(ci.termID);
  });
  courseAcademicTerms = _.uniq(courseAcademicTerms);
  return academicTerms;
};
