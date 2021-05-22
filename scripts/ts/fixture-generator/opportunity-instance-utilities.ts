import { isSummerTerm, multipleNextAcademicTerm, multipleNextNonSummerTerm, multiplePrevAcademicTerm, multiplePrevNonSummerTerm, nextAcademicTerm } from './academic-term-utilities';
import { PlanOpportunityItem } from './user-config-file.js';

interface OpportunityInstance {
  academicTerm: string;
  opportunity: string;
  sponsor?: string;
  verified: boolean;
  student: string;
  retired?: boolean;
}

export const generateOpportunityInstance = (student: string, planItem: PlanOpportunityItem, currentTerm: string, quarters: boolean): OpportunityInstance => {
  const opportunity = planItem.slug;
  const verified = planItem.academicTermOffset < 0 && planItem.verified;
  let academicTerm = currentTerm;
  if (planItem.academicTermOffset < 0) {
    academicTerm = multiplePrevAcademicTerm(currentTerm, quarters, -1 * planItem.academicTermOffset);
  } else if (planItem.academicTermOffset > 0) {
    academicTerm = multipleNextAcademicTerm(currentTerm, quarters, planItem.academicTermOffset);
  } else if (isSummerTerm(currentTerm)) {
    academicTerm = nextAcademicTerm(currentTerm, quarters);
  } else {
    academicTerm = currentTerm;
  }
  return {
    academicTerm,
    opportunity,
    verified,
    student,
  };
};
