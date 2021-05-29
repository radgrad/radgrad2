import { getAcademicTerm, isSummerTerm, multipleNextNonSummerTerm, multiplePrevNonSummerTerm, nextAcademicTerm } from './academic-term-utilities';
import AcademicTermCollection, { AcademicTerms } from './AcademicTermCollection';
import { PlanCourseItem } from './user-config-file.js';

const courseSlugToNote = (slug: string): string => {
  const split = slug.split('_');
  return `${split[0].toUpperCase()} ${split[1]}`;
};

export interface CourseInstance {
  academicTerm: string;
  course: string;
  verified?: boolean;
  fromRegistrar?: boolean;
  grade: string;
  note?: string;
  student: string;
  creditHrs?: number;
  retired?: boolean;
}

export const generateCourseInstance = (student: string, planItem: PlanCourseItem, academicTerms: AcademicTermCollection): CourseInstance => {
  const currentTerm = academicTerms.getCurrentTerm();
  const quarters = academicTerms.isQuarterSystem();
  const course = planItem.slug;
  const note = courseSlugToNote(course);
  const creditHrs = 3;
  const academicTerm = getAcademicTerm(currentTerm, planItem.academicYearOffset, planItem.termNum, quarters);
  let verified;
  let fromRegistrar;
  const grade = planItem.grade;
  const result = academicTerms.compareTerms(academicTerm, currentTerm);
  if (result < 0) {
    // academicTerm is in the past
    verified = true;
    fromRegistrar = true;
  } else if (result > 0) {
    // academicTerm is in the future
    verified = false;
    fromRegistrar = false;
  } else {
    // current term
    verified = false;
    fromRegistrar = true;
  }
  return {
    academicTerm,
    course,
    note,
    verified,
    fromRegistrar,
    student,
    grade,
    creditHrs,
  };
};
