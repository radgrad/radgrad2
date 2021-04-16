import { Courses } from '../../../../../api/course/CourseCollection';
import PreferredChoice from '../../../../../api/degree-plan/PreferredChoice';
import { Opportunities } from '../../../../../api/opportunity/OpportunityCollection';
import { Course, Opportunity } from '../../../../../typings/radgrad';

export const getRecommendedOpportunitiesInnovation = (interestIDs: string[], projectedICE: number): Opportunity[] => {
  let projected = projectedICE;
  const opportunities = Opportunities.findNonRetired({});
  const choices = new PreferredChoice(opportunities, interestIDs);
  const bestChoices = choices.getOrderedChoices();
  const recommended = [];
  while (projected < 100) {
    const item = bestChoices.shift();
    projected += item.ice.i;
    recommended.push(item);
  }
  return recommended;
};

export const getRecommendedOpportunitiesExperience = (interestIDs: string[], projectedICE: number): Opportunity[] => {
  let projected = projectedICE;
  const opportunities = Opportunities.findNonRetired({});
  const choices = new PreferredChoice(opportunities, interestIDs);
  const bestChoices = choices.getOrderedChoices();
  const recommended = [];
  while (projected < 100) {
    const item = bestChoices.shift();
    projected += item.ice.e;
    recommended.push(item);
  }
  return recommended;
};

export const getRecommendedCourses = (interestIDs: string[], projectedICE: number): Course[] => {
  let projected = projectedICE;
  const courses = Courses.findNonRetired({});
  const choices = new PreferredChoice(courses, interestIDs);
  const bestChoices = choices.getOrderedChoices();
  const recommended = [];
  while (projected < 100) {
    const item = bestChoices.shift();
    projected += item.ice.c;
    recommended.push(item);
  }
  return recommended;
};
