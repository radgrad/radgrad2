import { Courses } from '../../../../../api/course/CourseCollection';
import PreferredChoice from '../../../../../api/degree-plan/PreferredChoice';
import { gradeCompetency } from '../../../../../api/ice/IceProcessor';
import { Opportunities } from '../../../../../api/opportunity/OpportunityCollection';
import { Course, Opportunity } from '../../../../../typings/radgrad';

export const getRecommendedOpportunities = (interestIDs: string[], projectedICE: number, type: 'i' | 'c' | 'e'): Opportunity[] => {
  let projected = projectedICE;
  const opportunities = Opportunities.findNonRetired({});
  const choices = new PreferredChoice(opportunities, interestIDs);
  const bestChoices = choices.getOrderedChoices();
  const recommended = [];
  while (projected < 100) {
    const item = bestChoices.shift();
    if (item.ice[type] > 0) {
      projected += item.ice[type];
      recommended.push(item);
    }
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
    projected += gradeCompetency.A; // Assuming they get an A.
    recommended.push(item);
  }
  return recommended;
};
