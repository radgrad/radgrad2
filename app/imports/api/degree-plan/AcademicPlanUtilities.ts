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

export function getCourseListIndex(coursesPerAcademicTerm: number[], termNum: number) {
  // console.log(coursesPerAcademicTerm, termNum);
  let index = 0;
  let i = 0;
  for (i = 0; i < termNum; i++) {
    index += coursesPerAcademicTerm[i];
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

export function addChoiceToRaw(choice: string, termNum: number, choiceList: string[], coursesPerAcademicTerm: number[]) {
  const listIndex = getCourseListIndex(coursesPerAcademicTerm, termNum);
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
  addChoiceToRaw(choice, termNum, academicPlan.courseList, academicPlan.coursesPerAcademicTerm);
}
