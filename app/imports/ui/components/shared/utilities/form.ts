import { Courses } from '../../../../api/course/CourseCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';

export const interestSlugFromName = (name: string): string => {
  const interest = Interests.findDoc(name);
  return Slugs.getNameFromID(interest.slugID);
};

export const careerGoalSlugFromName = (name: string): string => {
  const careerGoal = CareerGoals.findDoc(name);
  return Slugs.getNameFromID(careerGoal.slugID);
};

export const courseSlugFromName = (name: string): string => {
  const course = Courses.findDoc(name);
  return Slugs.getNameFromID(course.slugID);
};

export const opportunitySlugFromName = (name: string): string => {
  const opp = Opportunities.findDoc(name);
  return Slugs.getNameFromID(opp.slugID);
};

export const declaredAcademicTermSlugFromName = (name: string): string => {
  const split = name.split(' ');
  const term = split[0];
  const year = parseInt(split[1], 10);
  const doc = AcademicTerms.findDoc({ term, year });
  return Slugs.findDoc(doc.slugID).name;
};
