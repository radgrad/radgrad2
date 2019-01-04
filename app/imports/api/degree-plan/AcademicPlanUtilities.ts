import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { IAcademicPlan, ICourseInstance } from '../../typings/radgrad';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Slugs } from '../slug/SlugCollection';
import * as PlanChoiceUtils from './PlanChoiceUtilities';

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
