import _ from 'lodash';
import { RadGrad } from '../../api/radgrad/RadGrad';

const globalPubSubLite = {
  academicPlan: 'AcademicPlanCollection',
  academicTerm: 'AcademicTermCollection',
  adminProfile: 'AdminProfileCollection',
  advisorProfile: 'AdvisorProfileCollection',
  careerGoal: 'CareerGoalCollection',
  course: 'CourseCollection',
  desiredDegree: 'DesiredDegreeCollection',
  facultyProfile: 'FacultyProfileCollection',
  helpMessage: 'HelpMessageCollection',
  interest: 'InterestCollection',
  interestType: 'InterestTypeCollection',
  mentorAnswer: 'MentorAnswerCollection',
  mentorProfile: 'MentorProfileCollection',
  mentorQuestion: 'MentorQuestionCollection',
  opportunity: 'OpportunityCollection',
  opportunityType: 'OpportunityTypeCollection',
  pageInterestsDailySnapshot: 'PageInterestsDailySnapshotCollection',
  planChoice: 'PlanChoiceCollection',
  publicStats: 'PublicStatsCollection',
  review: 'ReviewCollection',
  studentParticipation: 'StudentParticipationCollection',
  slug: 'SlugCollection',
  teaser: 'TeaserCollection',
};

export const isPubSubLiteCollection = (collectionName) => _.includes(_.values(globalPubSubLite), collectionName);

export const getGlobalPubSubLiteHandles = () => _.map(_.values(globalPubSubLite), (collectionName) => RadGrad.getCollection(collectionName).subscribe());
