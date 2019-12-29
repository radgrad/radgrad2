import faker from 'faker';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { Courses } from './CourseCollection';
import { CourseInstances } from './CourseInstanceCollection';
import { makeSampleInterestArray } from '../interest/SampleInterests';
import { getRandomCourseSlug } from './CourseUtilities';

const makePrerequisiteArray = (numPrereqs: number = 0) => {
  const retVal = [];
  for (let i = 0; i < numPrereqs; i++) {
    retVal.push(getRandomCourseSlug());
  }
  return retVal;
};

/**
 * Creates a Course with a unique slug and returns its docID.
 * @param args An optional object containing arguments to the courses.define function.
 * @returns { String } The docID of the newly generated Course.
 * @memberOf api/course
 */
export function makeSampleCourse(args?: { num?: string; interestID?: string; }) {
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
  const prerequisites = makePrerequisiteArray(faker.random.number({ max: 4 }));
  return Courses.define({ name, slug, num, description, creditHrs, syllabus, prerequisites, interests });
}

/**
 * Creates a CourseInstance with a unique slug and returns its docID.
 * Also creates a new Course.
 * @param student The student slug associated with this course.
 * @param args Optional object providing arguments to the CourseInstance definition.
 * @returns { String } The docID for the newly generated Interest.
 * @memberOf api/course
 */
export function makeSampleCourseInstance(student, args) {
  const academicTerm = AcademicTerms.define({ term: AcademicTerms.FALL, year: 2013 });
  const course = (args && args.course) ? args.course : makeSampleCourse();
  const verified = true;
  const grade = 'A';
  const note = `ABC ${course.num}`;
  return CourseInstances.define({ academicTerm, course, verified, grade, student, note });
}
