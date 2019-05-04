import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';

export const interestSlugFromName = (name: string): string => {
  const interest = Interests.findDoc(name);
  return Slugs.findDoc(interest.slugID).name;
};

export const careerGoalSlugFromName = (name: string): string => {
  const careerGoal = CareerGoals.findDoc(name);
  return Slugs.findDoc(careerGoal.slugID).name;
};

export const academicPlanSlugFromName = (name: string): string => {
  const plan = AcademicPlans.findDoc(name);
  return Slugs.findDoc(plan.slugID).name;
};
