import _ from 'lodash';
import { Courses } from '../../../../../api/course/CourseCollection';
import { CourseInstances } from '../../../../../api/course/CourseInstanceCollection';
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

export const getRecommendedCourses = (interestIDs: string[], projectedICE: number, profileID: string): Course[] => {
  const courseInstances = CourseInstances.findNonRetired({ profileID });
  const courseIDs = _.uniq(courseInstances.map(instance => instance.courseID));
  let projected = projectedICE;
  const courses = Courses.findNonRetired({});
  const choices = new PreferredChoice(courses, interestIDs);
  const bestChoices = choices.getOrderedChoices();
  const recommended = [];
  while (projected < 100) {
    const item = bestChoices.shift();
    if (!courseIDs.find(id => id === item._id)) {
      projected += gradeCompetency.A; // Assuming they get an A.
      recommended.push(item);
    }
  }
  return recommended;
};
