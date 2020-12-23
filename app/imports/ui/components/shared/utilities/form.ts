import { Interests } from '../../../../api/interest/InterestCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';

export const interestSlugFromName = (name: string): string => {
  const interest = Interests.findDoc(name);
  return Slugs.findDoc(interest.slugID).name;
};

export const careerGoalSlugFromName = (name: string): string => {
  const careerGoal = CareerGoals.findDoc(name);
  return Slugs.findDoc(careerGoal.slugID).name;
};

export const declaredAcademicTermSlugFromName = (name: string): string => {
  const split = name.split(' ');
  const term = split[0];
  const year = parseInt(split[1], 10);
  const doc = AcademicTerms.findDoc({ term, year });
  return Slugs.findDoc(doc.slugID).name;
};
