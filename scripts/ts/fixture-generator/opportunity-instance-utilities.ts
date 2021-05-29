import { getAcademicTerm, isSummerTerm, multipleNextAcademicTerm, multipleNextNonSummerTerm, multiplePrevAcademicTerm, multiplePrevNonSummerTerm, nextAcademicTerm } from './academic-term-utilities';
import { PlanOpportunityItem } from './user-config-file.js';

export interface OpportunityInstance {
  academicTerm: string;
  opportunity: string;
  sponsor?: string;
  verified: boolean;
  student: string;
  retired?: boolean;
}

export const generateOpportunityInstance = (student: string, planItem: PlanOpportunityItem, currentTerm: string, quarters: boolean): OpportunityInstance => {
  const opportunity = planItem.slug;
  const verified = planItem.academicYearOffset < 0 && planItem.verified;
  const academicTerm = getAcademicTerm(currentTerm, planItem.academicYearOffset, planItem.termNum, quarters);
  return {
    academicTerm,
    opportunity,
    verified,
    student,
  };
};
