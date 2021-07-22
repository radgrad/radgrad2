import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { instanceIsNowOrFuture } from '../utilities/instance-utilities';
import { CourseInstances } from './CourseInstanceCollection';
import { Courses } from './CourseCollection';
import PreferredChoice from '../degree-plan/PreferredChoice';
import { Users } from '../user/UserCollection';
import { profileGetInterestIDs } from '../../ui/components/shared/utilities/data-model';
import { Course, CourseInstance } from '../../typings/radgrad';

// Technical Debt: Hard codes 3xx and 4xx. This might not work for other Universities.

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min); // eslint-disable-line no-param-reassign
  max = Math.floor(max); // eslint-disable-line no-param-reassign
  return Math.floor(Math.random() * (max - min)) + min;
};

export const clearPlannedCourseInstances = (studentID: string) => {
  const courses = CourseInstances.find({ studentID, verified: false, fromRegistrar: false }).fetch();
  courses.forEach((ci) => {
    CourseInstances.removeIt(ci);
  });
};

// CAM: What is the right behavior if ci is undefined?
export const courseInstanceIsRepeatable = (ci: CourseInstance): boolean => ci && Courses.findDoc(ci.courseID).repeatable;

export const courseIsRepeatable = (course: Course): boolean => course?.repeatable;

export const get300LevelDocs = (): Course[] => Courses.find({ num: /3\d\d/ }).fetch();

export const getStudent300LevelDocs = (studentID: string, coursesTakenSlugs: string[]) => {
  let ret = [];
  const courses: Course[] = get300LevelDocs();
  const instances = CourseInstances.find({ studentID }).fetch();
  const courseTakenIDs = [];
  instances.forEach((courseInstance) => {
    if (CourseInstances.isInteresting(courseInstance._id)) {
      if (courseInstance.note !== 'ICS 499') { // TODO: hardcoded ICS string
        courseTakenIDs.push(courseInstance.courseID);
      }
    }
  });
  ret = courses.filter((c) => _.indexOf(courseTakenIDs, c._id) === -1);
  return ret;
};

export const bestStudent300LevelCourses = (studentID: string, coursesTakenSlugs: string[]) => {
  const choices = getStudent300LevelDocs(studentID, coursesTakenSlugs);
  const profile = Users.getProfile(studentID);
  const interestIDs = profileGetInterestIDs(profile);
  const preferred = new PreferredChoice(choices, interestIDs);
  return preferred.getBestChoices();
};

export const chooseStudent300LevelCourse = (studentID: string, coursesTakenSlugs: string[]): Course => {
  const best = bestStudent300LevelCourses(studentID, coursesTakenSlugs);
  return best[getRandomInt(0, best.length)];
};

export const get400LevelDocs = (): Course[] => Courses.find({ number: /4\d\d/ }).fetch();

export const getStudent400LevelDocs = (studentID: string, coursesTakenSlugs: string[]): Course[] => {
  let ret = [];
  const courses = get400LevelDocs();
  const instances = CourseInstances.find({ studentID }).fetch();
  const courseTakenIDs = [];
  instances.forEach((courseInstance) => {
    if (CourseInstances.isInteresting(courseInstance._id)) {
      if (!courseInstance.note.endsWith('499')) {
        courseTakenIDs.push(courseInstance.courseID);
      }
    }
  });
  ret = courses.filter((c) => _.indexOf(courseTakenIDs, c._id) === -1);
  return ret;
};

export const bestStudent400LevelCourses = (studentID: string, coursesTakenSlugs: string[]): Course[] => {
  const choices = getStudent400LevelDocs(studentID, coursesTakenSlugs);
  const profile = Users.getProfile(studentID);
  const interestIDs = profileGetInterestIDs(profile);
  const preferred = new PreferredChoice(choices, interestIDs);
  return preferred.getBestChoices();
};

export const chooseStudent400LevelCourse = (studentID: string, coursesTakenSlugs: string[]): Course => {
  const best = bestStudent400LevelCourses(studentID, coursesTakenSlugs);
  return best[getRandomInt(0, best.length)];
};

/**
 * Chooses the 'best' course to take given an array of slugs, the student and the courses the student
 * has taken.
 * @param slugs an array of course slugs to choose between.
 * @param studentID the student's ID.
 * @param coursesTakenSlugs an array of the course slugs the student has taken.
 * @returns {*}
 * @memberOf api/course
 */
export const chooseBetween = (slugs: string[], studentID: string, coursesTakenSlugs: string[]): Course | null => {
  // console.log('chooseBetween', slugs, coursesTakenSlugs);
  const courses = [];
  slugs.forEach((slug) => {
    const courseID = Courses.getID(slug);
    courses.push(Courses.findDoc(courseID));
  });
  const profile = Users.getProfile(studentID);
  const interestIDs = profileGetInterestIDs(profile);
  const preferred = new PreferredChoice(courses, interestIDs);
  const best = preferred.getBestChoices();
  if (best) {
    // console.log('chooseBetween', best, interestIDs);
    return best[getRandomInt(0, best.length)];
  }
  return null;
};

/**
 * Checks the format of the getCourseSlug. Does not check to see if the slug is defined. Valid course
 * slugs have the format <dept>_<number>.
 * @param courseSlug the slug to check.
 * @returns {boolean}
 * @throws Meteor.Error if the slug doesn't have the right format.
 */
export const validateCourseSlugFormat = (courseSlug: string): boolean => {
  if (courseSlug !== 'other' && courseSlug.indexOf('_') === -1) {
    throw new Meteor.Error(`${courseSlug} is not a valid course slug.`);
  }
  return true;
};

/**
 * Returns the department from the given course slug.
 * @param courseSlug the course slug.
 * @returns {string}
 * @memberOf api/course
 */
export const getDepartment = (courseSlug: string): string => courseSlug.split('_')[0].toUpperCase();

/**
 * Returns the number portion of the getCourseSlug.
 * @param courseSlug the course slug.
 * @returns {string}
 */
export const getCourseNumber = (courseSlug: string): string => courseSlug.split('_')[1];

export const passedCourse = (ci: CourseInstance): boolean => ci && ((_.includes(['CR', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+'], ci.grade) && ci.verified) || instanceIsNowOrFuture(ci));
