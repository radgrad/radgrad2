import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { IAcademicPlan, ICourseInstance } from '../../typings/radgrad'; // eslint-disable-line
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Slugs } from '../slug/SlugCollection';
import * as PlanChoiceUtils from './PlanChoiceUtilities';
import { RadGradSettings } from '../radgrad/RadGradSettingsCollection';

export function getPlanChoices(academicPlan: IAcademicPlan, termNum: number): string[] {
  if (termNum < 0 || termNum > academicPlan.coursesPerAcademicTerm.length - 1) {
    throw new Meteor.Error(`Bad termNum ${termNum}`);
  }
  let numChoices = 0;
  for (let i = 0; i < termNum; i++) {
    numChoices += academicPlan.coursesPerAcademicTerm[i];
  }
  const numTermChoices = academicPlan.coursesPerAcademicTerm[termNum];
  // console.log(academicPlan.coursesPerAcademicTerm, termNum, numTermChoices, academicPlan.courseList.slice(numChoices, numChoices + numTermChoices));
  return academicPlan.courseList.slice(numChoices, numChoices + numTermChoices);
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
  let count = 0;
  _.forEach(takenSlugs, (slug) => {
    if (PlanChoiceUtils.satisfiesPlanChoice(planChoice, slug)) {
      count++;
    }
  });
  const ret = count >= planCount;
  // console.log('isPlanChoiceSatisfied(%s, %o) returns %o', planChoice, takenSlugs, ret);
  return ret;
}

export function isAcademicPlanValid(academicPlan: IAcademicPlan): boolean {
  const quarters = RadGradSettings.findOne({}).quarterSystem;
  // check the coursesPerAcademicTerm length
  if (quarters) {
    if (academicPlan.coursesPerAcademicTerm.length % 4 !== 0) {
      return false;
    }
  } else if (academicPlan.coursesPerAcademicTerm.length % 3 !== 0) {
    return false;
  }
  // check the courseList length to the sum of the coursesPerTerm
  const numCourses = _.reduce(academicPlan.coursesPerAcademicTerm, (sum, n) => sum + n, 0);
  if (numCourses !== academicPlan.courseList.length) {
    return false;
  }
  // check the courseList to see if has numbers.
  if (!_.each(academicPlan.courseList, (choice) => PlanChoiceUtils.getPlanCount(choice) !== 0)) {
    return false;
  }
  // check to see if courseList numbers are correct.
  return true;
}

function getCourseListIndex(coursesPerAcademicTerm: number[], termNum: number) {
  let index = 0;
  let i = 0;
  for (i = 0; i < termNum; i++) {
    index += coursesPerAcademicTerm[i];
  }
  if (coursesPerAcademicTerm[i]) {
    index += coursesPerAcademicTerm[i];
  }
  return index;
}

export function addChoiceToPlan(academicPlan: IAcademicPlan, termNum: number, choice: string) {
  const listIndex = getCourseListIndex(academicPlan.coursesPerAcademicTerm, termNum);
  const choiceWithNum = `${choice}-1`;
  console.log(listIndex, choiceWithNum);
  if (listIndex === 0) {
    academicPlan.courseList.unshift(choiceWithNum);
  } else if (listIndex === academicPlan.courseList.length) {
    academicPlan.courseList.push(choiceWithNum);
  } else {
    academicPlan.courseList.splice(listIndex, 0, choiceWithNum);
  }
  if (academicPlan.coursesPerAcademicTerm[termNum]) {
    academicPlan.coursesPerAcademicTerm[termNum] += 1; // eslint-disable-line no-param-reassign
  } else {
    academicPlan.coursesPerAcademicTerm[termNum] = 1; // eslint-disable-line no-param-reassign
  }
}
