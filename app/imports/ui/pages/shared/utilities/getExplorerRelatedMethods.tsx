import _ from 'lodash';
import { Course, Opportunity, RelatedCoursesOrOpportunities } from '../../../../typings/radgrad';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';

export const getBaseURL = (match: any): string => { // getting an es-lint error here 
  const split = match.url.split('/');
  const temp = [];
  temp.push(split[0]);
  temp.push(split[1]);
  temp.push(split[2]);
  temp.push(split[3]);
  return temp.join('/');
};

export const getAssociationRelatedCourses = (courses: Course[], studentID: string): RelatedCoursesOrOpportunities => {
  const inPlanInstances = CourseInstances.findNonRetired({
    studentID,
    verified: false,
  });
  const inPlanIDs = _.uniq(inPlanInstances.map(instance => instance.courseID));

  const completedInstance = CourseInstances.findNonRetired({
    studentID,
    verified: true,
  });
  const completedIDs = _.uniq((completedInstance.map(instance => instance.courseID)));

  const relatedIDs = _.uniq(courses.map(instance => instance._id));
  const relatedInPlanIDs = _.intersection(relatedIDs, inPlanIDs);
  const relatedCompletedIDs = _.intersection(relatedIDs, completedIDs);
  const relatedNotInPlanIDs = _.difference(relatedIDs, relatedInPlanIDs, relatedCompletedIDs);

  const relatedCourses = {
    completed: relatedCompletedIDs,
    inPlan: relatedInPlanIDs,
    notInPlan: relatedNotInPlanIDs,
  };
  return relatedCourses;
};

export const getAssociationRelatedOpportunities = (opportunities: Opportunity[], studentID: string): RelatedCoursesOrOpportunities => {
  const inPlanInstances = OpportunityInstances.find({
    studentID,
    verified: false,
  }).fetch();
  const inPlanIDs = _.uniq(inPlanInstances.map(instance => instance.opportunityID));


  const completedInstances = OpportunityInstances.find({
    studentID,
    verified: true,
  }).fetch();
  const completedIDs = _.uniq(completedInstances.map(instance => instance.opportunityID));

  const relatedIDs = _.uniq(opportunities.map(instance => instance._id));
  const relatedInPlanIDs = _.intersection(relatedIDs, inPlanIDs);
  const relatedCompletedIDs = _.intersection(relatedIDs, completedIDs);
  const relatedNotInPlanIDs = _.difference(relatedIDs, relatedInPlanIDs, relatedCompletedIDs);

  const relatedOpportunities = {
    completed: relatedCompletedIDs,
    inPlan: relatedInPlanIDs,
    notInPlan: relatedNotInPlanIDs,
  };
  return relatedOpportunities;
};
