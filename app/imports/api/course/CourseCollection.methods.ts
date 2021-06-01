import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Courses } from './CourseCollection';
import { CourseInstances } from './CourseInstanceCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { nextAcademicTerm } from '../academic-term/AcademicTermUtilities';
import { RadGradProperties } from '../radgrad/RadGradProperties';

/**
 * Returns an array with two elements: a string with the shortName of the academicTerm, and an integer indicating the
 * current planned enrollment for the course in that academicTerm.
 * @param courseID The ID of the course.
 * @param termID The ID of the academicTerm.
 * @memberOf api/course
 */
const getEnrollmentData = (courseID, termID) => {
  const academicTermShortName = AcademicTerms.getShortName(termID);
  const enrollment = CourseInstances.getCollection().find({ termID, courseID }).count();
  return [academicTermShortName, enrollment];
};

/**
 * Given a courseID, returns enrollment data for the upcoming 9 academicTerms.
 * The returned data is an object with fields courseID and enrollmentData.
 * CourseID is the course ID.
 * EnrollmentData is an array of arrays. Each interior array is a tuple: a string containing the shortname and an
 * integer indicating the enrollment data.
 * @memberOf api/course
 * @example
 * { courseID: 'xghuyf2132q3',
 *   enrollmentData: [['Sp19', 0], ['Su19', 1], ['Fa19', 5],
 *                    ['Sp20', 25], ['Su20', 2], ['Fa20', 0],
 *                    ['Sp21', 1], ['Su21', 0], ['Fa21', 1]]
 * }
 */
export const getFutureEnrollmentMethod = new ValidatedMethod({
  name: 'CourseCollection.getFutureEnrollment',
  mixins: [CallPromiseMixin],
  validate: null,
  run(courseID) {
    if (Meteor.isServer) {
      // Throw error if an invalid courseID is passed.
      Courses.assertDefined(courseID);
      // Create an array of the upcoming 9 academicTerms after the current academicTerm.
      let academicTermDoc = AcademicTerms.getCurrentAcademicTermDoc();
      let termsPerYear = 3;
      if (RadGradProperties.getQuarterSystem()) {
        termsPerYear = 4;
      }
      const academicTermList = [];
      for (let i = 0; i < 3 * termsPerYear; i++) {
        academicTermDoc = nextAcademicTerm(academicTermDoc);
        academicTermList.push(academicTermDoc);
      }
      // Map over these academicTerms and return a new list that includes the enrollment data for this course and academicTerm.
      const enrollmentData = academicTermList.map((doc) => getEnrollmentData(courseID, AcademicTerms.getID(doc)));
      return { courseID, enrollmentData };
    }
    return null;
  },
});
