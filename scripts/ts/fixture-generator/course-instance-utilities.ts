import { isSummerTerm, multipleNextNonSummerTerm, multiplePrevNonSummerTerm, nextAcademicTerm } from './academic-term-utilities';
import { PlanCourseItem } from './user-config-file.js';

const courseSlugToNote = (slug: string): string => {
  const split = slug.split('_');
  return `${split[0].toUpperCase()} ${split[1]}`;
};

export interface CourseInstanceDefine {
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

export const generateCourseInstance = (student: string, planItem: PlanCourseItem, currentTerm: string, quarters: boolean): CourseInstanceDefine => {
  const course = planItem.slug;
  const note = courseSlugToNote(course);
  const creditHrs = 3;
  let academicTerm;
  let verified;
  let fromRegistrar;
  const grade = planItem.grade;
  if (planItem.academicTermOffset < 0) {
    academicTerm = multiplePrevNonSummerTerm(currentTerm, quarters, -1 * planItem.academicTermOffset);
    verified = true;
    fromRegistrar = true;
  } else if (planItem.academicTermOffset > 0) {
    const summerAdd = isSummerTerm(currentTerm) ? 1 : 0;
    academicTerm = multipleNextNonSummerTerm(currentTerm, quarters, planItem.academicTermOffset + summerAdd);
    verified = false;
    fromRegistrar = false;
  } else if (isSummerTerm(currentTerm)) {
      academicTerm = nextAcademicTerm(currentTerm, quarters);
      verified = false;
      fromRegistrar = false;
    } else {
      academicTerm = currentTerm;
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
