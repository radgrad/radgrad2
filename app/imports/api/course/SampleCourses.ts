import { moment } from 'meteor/momentjs:moment';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { Courses } from './CourseCollection';
import { CourseInstances } from './CourseInstanceCollection';
import { makeSampleInterest } from '../interest/SampleInterests';

/**
 * The name of the sample course.
 * @type {string}
 * @memberOf api/course
 */
export const sampleCourseName = 'Sample Course';

/**
 * Creates a Course with a unique slug and returns its docID.
 * @param args An optional object containing arguments to the courses.define function.
 * @returns { String } The docID of the newly generated Course.
 * @memberOf api/course
 */
export function makeSampleCourse(args?: { num?: string; interestID?: string; }) {
  const name = sampleCourseName;
  const uniqueString = moment().format('YYYYMMDDHHmmssSSSSS');
  const slug = `course-${uniqueString}`;
  const num = (args && args.num) ? args.num : `Course ${uniqueString}`;
  const description = 'Sample course description';
  const creditHrs = 3;
  const interestID = (args && args.interestID) ? args.interestID : makeSampleInterest();
  const interests = [interestID];
  return Courses.define({ name, slug, num, description, creditHrs, interests });
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
