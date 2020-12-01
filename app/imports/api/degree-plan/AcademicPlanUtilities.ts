import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { IAcademicPlan, ICourseInstance } from '../../typings/radgrad';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Slugs } from '../slug/SlugCollection';
import { complexChoiceToArray } from './PlanChoiceUtilities';
import * as PlanChoiceUtils from './PlanChoiceUtilities';
import { RadGradProperties } from '../radgrad/RadGradProperties';

export function getPlanChoicesRaw(coursesPerTerm: number[], choiceList: string[], termNum: number) {
  if (termNum < 0 || termNum > coursesPerTerm.length - 1) {
    throw new Meteor.Error(`Bad termNum ${termNum}`);
  }
  let numChoices = 0;
  for (let i = 0; i < termNum; i++) {
    numChoices += coursesPerTerm[i];
  }
  const numTermChoices = coursesPerTerm[termNum];
  // console.log(academicPlan.coursesPerAcademicTerm, termNum, numTermChoices, academicPlan.choiceList.slice(numChoices, numChoices + numTermChoices));
  return choiceList.slice(numChoices, numChoices + numTermChoices);
}

export function getPlanChoices(academicPlan: IAcademicPlan, termNum: number): string[] {
  return getPlanChoicesRaw(academicPlan.coursesPerAcademicTerm, academicPlan.choiceList, termNum);
}

export function passedCourse(ci: ICourseInstance): boolean {
  const courseDoc = CourseInstances.getCourseDoc(ci._id);
  const courseSlug = Slugs.getNameFromID(courseDoc.slugID);
  // TODO: We need another way of representing 'passing'
  if (courseSlug.includes('111') || courseSlug.includes('141') || courseSlug.includes('211') || courseSlug.includes('241')) {
    return _.includes(['B', 'B+', 'A-', 'A', 'A+'], ci.grade);
  }
  return _.includes(['C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+'], ci.grade);
}

export function isPlanChoiceSatisfied(planChoice: string, takenSlugs: string[]): boolean {
  const planCount = PlanChoiceUtils.getPlanCount(planChoice);
  const planSlug = PlanChoiceUtils.stripCounter(planChoice);
  const courseSlugs = complexChoiceToArray(planSlug);
  let count = 0;
  _.forEach(takenSlugs, (slug) => {
    _.forEach(courseSlugs, (cSlug) => {
      if (PlanChoiceUtils.satisfiesPlanChoice(cSlug, slug)) {
        count++;
      }
    });
  });
  const ret = count >= planCount;
  // console.log('isPlanChoiceSatisfied(%s, %o) returns %o', planChoice, takenSlugs, ret);
  return ret;
}

export function isAcademicPlanValid(academicPlan: IAcademicPlan): boolean {
  const quarters = RadGradProperties.getQuarterSystem();
  // check the coursesPerAcademicTerm length
  if (quarters) {
    if (academicPlan.coursesPerAcademicTerm.length % 4 !== 0) {
      return false;
    }
  } else if (academicPlan.coursesPerAcademicTerm.length % 3 !== 0) {
    return false;
  }
  // check the choiceList length to the sum of the coursesPerTerm
  const numCourses = _.reduce(academicPlan.coursesPerAcademicTerm, (sum, n) => sum + n, 0);
  if (numCourses !== academicPlan.choiceList.length) {
    return false;
  }
  // check the choiceList to see if has numbers.
  if (!_.each(academicPlan.choiceList, (choice) => PlanChoiceUtils.getPlanCount(choice) !== 0)) {
    return false;
  }
  // check to see if choiceList numbers are correct.
  return true;
}

export function getCourseListIndex(coursesPerAcademicTerm: number[], termNum: number, termIndex?: number) {
  // console.log(coursesPerAcademicTerm, termNum, termIndex);
  let index = 0;
  let i = 0;
  for (i = 0; i < termNum; i++) {
    index += coursesPerAcademicTerm[i];
  }
  if (termIndex) {
    index += termIndex;
  }
  // if (coursesPerAcademicTerm[i]) {
  //   index += coursesPerAcademicTerm[i];
  // }
  return index;
}

export function updateChoiceCounts(choiceList: string[]) {
  // create a map to count the choices
  const choiceCounts = {};
  // loop over each of the items in choiceList
  let i = 0;
  for (i = 0; i < choiceList.length; i++) {
    const choice = choiceList[i];
    // strip off the counter and check the choice in the map
    const noCount = PlanChoiceUtils.stripCounter(choice);
    if (choiceCounts[noCount]) {
      // update the choiceList[i]
      const seen = choiceCounts[noCount] + 1;
      choiceList[i] = `${noCount}-${seen}`; // eslint-disable-line no-param-reassign
      choiceCounts[noCount] = seen;
    } else {
      choiceList[i] = `${noCount}-1`; // eslint-disable-line no-param-reassign
      choiceCounts[noCount] = 1;
    }
  }
}

export function addChoiceToRaw(choice: string, termNum: number, choiceList: string[], coursesPerAcademicTerm: number[], termIndex?: number) {
  const listIndex = getCourseListIndex(coursesPerAcademicTerm, termNum, termIndex);
  const choiceWithNum = `${choice}-1`;
  if (listIndex === 0) {
    choiceList.unshift(choiceWithNum);
  } else if (listIndex === choiceList.length) {
    choiceList.push(choiceWithNum);
  } else {
    choiceList.splice(listIndex, 0, choiceWithNum);
  }
  if (coursesPerAcademicTerm[termNum]) {
    coursesPerAcademicTerm[termNum] += 1; // eslint-disable-line no-param-reassign
  } else {
    coursesPerAcademicTerm[termNum] = 1; // eslint-disable-line no-param-reassign
  }
  updateChoiceCounts(choiceList);
}

export function addChoiceToPlan(academicPlan: IAcademicPlan, termNum: number, choice: string) {
  addChoiceToRaw(choice, termNum, academicPlan.choiceList, academicPlan.coursesPerAcademicTerm);
}

function getListIndex(choice: string, choiceList: string[]) {
  const stripped = _.map(choiceList, (c) => PlanChoiceUtils.stripCounter(c));
  return stripped.indexOf(choice);
}

export function reorderChoicesInTermRaw(choice: string, termNumber: number, newIndex: number, choiceList: string[], coursesPerAcademicTerm: number[]) {
  // console.log('reorder', choice, termNumber, newIndex);
  const termChoices = getPlanChoicesRaw(coursesPerAcademicTerm, choiceList, termNumber);
  const oldTermIndex = getListIndex(choice, termChoices);
  const diff = newIndex - oldTermIndex;
  if (newIndex !== oldTermIndex) {
    const oldPosition = getListIndex(choice, choiceList);
    const newPosition = oldPosition + diff;
    const temp = choiceList[oldPosition];
    choiceList[oldPosition] = choiceList[newPosition]; // eslint-disable-line no-param-reassign
    choiceList[newPosition] = temp; // eslint-disable-line no-param-reassign
  }
}

export function removeChoiceFromPlanRaw(choice: string, termNumber: number, choiceList: string[], coursesPerAcademicTerm: number[]) {
  const clIndex = getCourseListIndex(coursesPerAcademicTerm, termNumber);
  for (let i = clIndex; i < choiceList.length; i++) {
    if (PlanChoiceUtils.stripCounter(choiceList[i]) === choice) {
      choiceList.splice(i, 1);
      break;
    }
  }
  coursesPerAcademicTerm[termNumber]--; // eslint-disable-line no-param-reassign
}

export function planHasCoursesRaw(coursesPerAcademicTerm: number[], yearNum: number): boolean {
  const quarterSystem = RadGradProperties.getQuarterSystem();
  let start;
  let end;
  let courses;
  if (quarterSystem) {
    start = yearNum * 4;
    end = start + 4;
    courses = coursesPerAcademicTerm.slice(start, end);
  } else {
    start = yearNum * 3;
    end = start + 3;
    courses = coursesPerAcademicTerm.slice(start, end);
  }
  // console.log('planHasCoursesRaw', start, end, courses, _.some(courses));
  return _.some(courses);
}

/**
 * Removes the year from coursesPerAcademicTerm if the coursesPerAcademicTerm are all 0.
 * @param {number[]} coursesPerAcademicTerm
 * @param {number} yearNum
 * @returns {number[]}
 */
export function removeYearFromPlanRaw(coursesPerAcademicTerm: number[], yearNum: number): number[] {
  const quarterSystem = RadGradProperties.getQuarterSystem();
  const start = quarterSystem ? yearNum * 4 : yearNum * 3;
  const numTerms = quarterSystem ? 4 : 3;
  if (!planHasCoursesRaw(coursesPerAcademicTerm, yearNum)) {
    return coursesPerAcademicTerm.splice(start, numTerms);
  }
  return coursesPerAcademicTerm;
}

/**
 * Removes the empty years from coursesPerAcademicTerm.
 * @param {number[]} coursesPerAcademicTerm
 * @returns {number[]}
 */
export function removeEmptyYearsRaw(coursesPerAcademicTerm: number[]): number[] {
  for (let i = 4; i >= 0; i--) {
    removeYearFromPlanRaw(coursesPerAcademicTerm, i);
  }
  return coursesPerAcademicTerm;
}
