import faker from 'faker';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { Courses } from './CourseCollection';
import { CourseInstances } from './CourseInstanceCollection';
import { makeSampleInterestArray } from '../interest/SampleInterests';
import { Slugs } from '../slug/SlugCollection';

/**
 * Returns a random department string.
 * @param {number} length
 * @returns {string}
 */
export const getRandomDepartment = (length = 3): string => {
  let retVal = '';
  for (let i = 0; i < length; i++) {
    retVal = `${retVal}${faker.random.alphaNumeric()}`;
  }
  return retVal;
};

/**
 * Returns a random course slug for the given department.
 * @param {string} dept the department
 * @param {number} min the minimum course number, (optional) defaults to 100.
 * @param {number} max the maximum course number, (optional) defaults to 800.
 * @returns {string}
 */
export const getRandomCourseSlugForDept = (dept: string, min = 100, max = 800): string => `${dept}_${faker.random.number({
  min,
  max,
})}`;

/**
 * Returns a random course slug for a random department.
 * @param {number} deptLength the length of the department string, defaults to 3.
 * @param {number} min the minimum course number, (optional) defaults to 100.
 * @param {number} max the maximum course number, (optional) defaults to 800.
 * @returns {string}
 */
export const getRandomCourseSlug = (deptLength = 3, min = 100, max = 800): string => {
  const deptName = getRandomDepartment(deptLength);
  return getRandomCourseSlugForDept(deptName, min, max);
};

/**
 * Creates a Course with a unique slug and returns its docID.
 * @param args An optional object containing arguments to the courses.define function.
 * @returns { String } The docID of the newly generated Course.
 * @memberOf api/course
 */
export const makeSampleCourse = (args?: { num?: string; interestID?: string; }): string => {
  const name = faker.lorem.words();
  const slug = getRandomCourseSlug();
  const num = (args && args.num) ? args.num : faker.lorem.words();
  const description = faker.lorem.paragraph();
  const creditHrs = faker.random.number({
    min: 1,
    max: 15,
  });
  const interests = (args && args.interestID) ? [args.interestID] : makeSampleInterestArray(faker.random.number({
    min: 1,
    max: 6,
  }));
  const syllabus = faker.lorem.paragraph();
  return Courses.define({ name, slug, num, description, creditHrs, syllabus, interests });
};

/**
 * Creates an array of defined course slugs.
 * @param num the number of slugs.
 * Returns an array of defined course slugs.
 */
export const makeSampleCourseSlugArray = (num = 1) => {
  const retVal = [];
  for (let i = 0; i < num; i++) {
    retVal.push(Slugs.getNameFromID(Courses.findDoc(makeSampleCourse()).slugID));
  }
  return retVal;
};

/**
 * Creates a CourseInstance with a unique slug and returns its docID.
 * Also creates a new Course.
 * @param student The student slug associated with this course.
 * @param args Optional object providing arguments to the CourseInstance definition.
 * @returns { String } The docID for the newly generated Interest.
 * @memberOf api/course
 */
export const makeSampleCourseInstance = (student: string, args): string => {
  const academicTerm = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2013 });
  const course = (args && args.course) ? args.course : makeSampleCourse();
  const verified = true;
  const grade = 'A';
  const note = `ABC ${course.num}`;
  return CourseInstances.define({ academicTerm, course, verified, grade, student, note });
};

export const getRandomGrade = (): string => {
  const index = faker.random.number({ min: 1, max: CourseInstances.validGrades.length - 1 });
  return CourseInstances.validGrades[index];
};
