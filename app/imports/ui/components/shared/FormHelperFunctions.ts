import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';

export const interestSlugFromName = (name: string): string => {
  const interest = Interests.findDoc(name);
  return Slugs.findDoc(interest.slugID).name;
};

export const careerGoalSlugFromName = (name: string): string => {
  const careerGoal = CareerGoals.findDoc(name);
  return Slugs.findDoc(careerGoal.slugID).name;
};
