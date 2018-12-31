import { Meteor } from 'meteor/meteor';

export function getPlanChoices(academicPlan, termNum) {
  if (termNum < 0 || termNum > academicPlan.coursesPerAcademicTerm.length - 1) {
    throw new Meteor.Error(`Bad termNum ${termNum}`);
  }
  let numChoices = 0;
  for (let i = 0; i < termNum; i++) {
    numChoices += academicPlan.coursesPerAcademicTerm[i];
  }
  const numTermChoices = academicPlan.coursesPerAcademicTerm[termNum];
  console.log(academicPlan.coursesPerAcademicTerm, termNum, numTermChoices, academicPlan.courseList.slice(numChoices, numChoices + numTermChoices));
  return academicPlan.courseList.slice(numChoices, numChoices + numTermChoices);
}
