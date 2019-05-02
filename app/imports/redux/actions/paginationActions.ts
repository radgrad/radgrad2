import {
  SET_ACADEMIC_PLANS_SHOW_COUNT, SET_ACADEMIC_PLANS_SHOW_INDEX,
  SET_ACADEMIC_TERMS_SHOW_COUNT, SET_ACADEMIC_TERMS_SHOW_INDEX,
  SET_ACADEMIC_YEARS_SHOW_COUNT, SET_ACADEMIC_YEARS_SHOW_INDEX,
  SET_ADVISOR_LOGS_SHOW_COUNT, SET_ADVISOR_LOGS_SHOW_INDEX, SET_ADVISORS_SHOW_COUNT, SET_ADVISORS_SHOW_INDEX,
  SET_CAREER_GOALS_SHOW_COUNT, SET_CAREER_GOALS_SHOW_INDEX,
  SET_COURSE_INSTANCES_SHOW_COUNT, SET_COURSE_INSTANCES_SHOW_INDEX,
  SET_COURSES_SHOW_COUNT, SET_COURSES_SHOW_INDEX,
  SET_DESIRED_DEGREES_SHOW_COUNT, SET_DESIRED_DEGREES_SHOW_INDEX, SET_FACULTY_SHOW_COUNT, SET_FACULTY_SHOW_INDEX,
  SET_FEEDBACK_INSTANCES_SHOW_COUNT, SET_FEEDBACK_INSTANCES_SHOW_INDEX,
  SET_FEEDS_SHOW_COUNT, SET_FEEDS_SHOW_INDEX,
  SET_HELP_MESSAGES_SHOW_COUNT, SET_HELP_MESSAGES_SHOW_INDEX,
  SET_INTEREST_TYPES_SHOW_COUNT, SET_INTEREST_TYPES_SHOW_INDEX,
  SET_INTERESTS_SHOW_COUNT, SET_INTERESTS_SHOW_INDEX,
  SET_MENTOR_ANSWERS_SHOW_COUNT, SET_MENTOR_ANSWERS_SHOW_INDEX,
  SET_MENTOR_QUESTIONS_SHOW_COUNT, SET_MENTOR_QUESTIONS_SHOW_INDEX, SET_MENTORS_SHOW_COUNT, SET_MENTORS_SHOW_INDEX,
  SET_OPPORTUNITIES_SHOW_COUNT, SET_OPPORTUNITIES_SHOW_INDEX,
  SET_OPPORTUNITY_INSTANCES_SHOW_COUNT, SET_OPPORTUNITY_INSTANCES_SHOW_INDEX,
  SET_OPPORTUNITY_TYPES_SHOW_COUNT, SET_OPPORTUNITY_TYPES_SHOW_INDEX,
  SET_PLAN_CHOICES_SHOW_COUNT, SET_PLAN_CHOICES_SHOW_INDEX,
  SET_REVIEWS_SHOW_COUNT, SET_REVIEWS_SHOW_INDEX,
  SET_SLUGS_SHOW_COUNT, SET_SLUGS_SHOW_INDEX, SET_STUDENTS_SHOW_COUNT, SET_STUDENTS_SHOW_INDEX,
  SET_TEASERS_SHOW_COUNT, SET_TEASERS_SHOW_INDEX,
  SET_VERIFICATION_REQUESTS_SHOW_COUNT, SET_VERIFICATION_REQUESTS_SHOW_INDEX,
} from './paginationActionTypes';
import { AcademicYearInstances } from '../../api/degree-plan/AcademicYearInstanceCollection';
import { AcademicPlans } from '../../api/degree-plan/AcademicPlanCollection';
import { AcademicTerms } from '../../api/academic-term/AcademicTermCollection';
import { AdvisorLogs } from '../../api/log/AdvisorLogCollection';
import { CareerGoals } from '../../api/career/CareerGoalCollection';
import { CourseInstances } from '../../api/course/CourseInstanceCollection';
import { Courses } from '../../api/course/CourseCollection';
import { DesiredDegrees } from '../../api/degree-plan/DesiredDegreeCollection';
import { Feeds } from '../../api/feed/FeedCollection';
import { FeedbackInstances } from '../../api/feedback/FeedbackInstanceCollection';
import { HelpMessages } from '../../api/help/HelpMessageCollection';
import { Interests } from '../../api/interest/InterestCollection';
import { InterestTypes } from '../../api/interest/InterestTypeCollection';
import { MentorAnswers } from '../../api/mentor/MentorAnswerCollection';
import { MentorQuestions } from '../../api/mentor/MentorQuestionCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../api/opportunity/OpportunityInstanceCollection';
import { OpportunityTypes } from '../../api/opportunity/OpportunityTypeCollection';
import { PlanChoices } from '../../api/degree-plan/PlanChoiceCollection';
import { Reviews } from '../../api/review/ReviewCollection';
import { Slugs } from '../../api/slug/SlugCollection';
import { Teasers } from '../../api/teaser/TeaserCollection';
import { VerificationRequests } from '../../api/verification/VerificationRequestCollection';
import { StudentProfiles } from '../../api/user/StudentProfileCollection';
import { AdvisorProfiles } from '../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../api/user/FacultyProfileCollection';
import { MentorProfiles } from '../../api/user/MentorProfileCollection';

export const setCollectionShowCount = (collectionName: string, count: number) => {
  const retval: {type?: string, payload?: number} = {};
  retval.payload = count;
  switch (collectionName) {
    case AcademicPlans.getCollectionName():
      retval.type = SET_ACADEMIC_PLANS_SHOW_COUNT;
      break;
    case AcademicTerms.getCollectionName():
      retval.type = SET_ACADEMIC_TERMS_SHOW_COUNT;
      break;
    case AcademicYearInstances.getCollectionName():
      retval.type = SET_ACADEMIC_YEARS_SHOW_COUNT;
      break;
    case AdvisorLogs.getCollectionName():
      retval.type = SET_ADVISOR_LOGS_SHOW_COUNT;
      break;
    case CareerGoals.getCollectionName():
      retval.type = SET_CAREER_GOALS_SHOW_COUNT;
      break;
    case CourseInstances.getCollectionName():
      retval.type = SET_COURSE_INSTANCES_SHOW_COUNT;
      break;
    case Courses.getCollectionName():
      retval.type = SET_COURSES_SHOW_COUNT;
      break;
    case DesiredDegrees.getCollectionName():
      retval.type = SET_DESIRED_DEGREES_SHOW_COUNT;
      break;
    case Feeds.getCollectionName():
      retval.type = SET_FEEDS_SHOW_COUNT;
      break;
    case FeedbackInstances.getCollectionName():
      retval.type = SET_FEEDBACK_INSTANCES_SHOW_COUNT;
      break;
    case HelpMessages.getCollectionName():
      retval.type = SET_HELP_MESSAGES_SHOW_COUNT;
      break;
    case Interests.getCollectionName():
      retval.type = SET_INTERESTS_SHOW_COUNT;
      break;
    case InterestTypes.getCollectionName():
      retval.type = SET_INTEREST_TYPES_SHOW_COUNT;
      break;
    case MentorAnswers.getCollectionName():
      retval.type = SET_MENTOR_ANSWERS_SHOW_COUNT;
      break;
    case MentorQuestions.getCollectionName():
      retval.type = SET_MENTOR_QUESTIONS_SHOW_COUNT;
      break;
    case Opportunities.getCollectionName():
      retval.type = SET_OPPORTUNITIES_SHOW_COUNT;
      break;
    case OpportunityInstances.getCollectionName():
      retval.type = SET_OPPORTUNITY_INSTANCES_SHOW_COUNT;
      break;
    case OpportunityTypes.getCollectionName():
      retval.type = SET_OPPORTUNITY_TYPES_SHOW_COUNT;
      break;
    case PlanChoices.getCollectionName():
      retval.type = SET_PLAN_CHOICES_SHOW_COUNT;
      break;
    case Reviews.getCollectionName():
      retval.type = SET_REVIEWS_SHOW_COUNT;
      break;
    case Slugs.getCollectionName():
      retval.type = SET_SLUGS_SHOW_COUNT;
      break;
    case AdvisorProfiles.getCollectionName():
      retval.type = SET_ADVISORS_SHOW_COUNT;
      break;
    case FacultyProfiles.getCollectionName():
      retval.type = SET_FACULTY_SHOW_COUNT;
      break;
    case MentorProfiles.getCollectionName():
      retval.type = SET_MENTORS_SHOW_COUNT;
      break;
    case StudentProfiles.getCollectionName():
      retval.type = SET_STUDENTS_SHOW_COUNT;
      break;
    case Teasers.getCollectionName():
      retval.type = SET_TEASERS_SHOW_COUNT;
      break;
    case VerificationRequests.getCollectionName():
      retval.type = SET_VERIFICATION_REQUESTS_SHOW_COUNT;
      break;
    default:
      // do nothing
  }
  return retval;
};

export const setCollectionShowIndex = (collectionName: string, index: number) => {
  const retval: {type?: string, payload?: number} = {};
  retval.payload = index;
  switch (collectionName) {
    case AcademicPlans.getCollectionName():
      retval.type = SET_ACADEMIC_PLANS_SHOW_INDEX;
      break;
    case AcademicTerms.getCollectionName():
      retval.type = SET_ACADEMIC_TERMS_SHOW_INDEX;
      break;
    case AcademicYearInstances.getCollectionName():
      retval.type = SET_ACADEMIC_YEARS_SHOW_INDEX;
      break;
    case AdvisorLogs.getCollectionName():
      retval.type = SET_ADVISOR_LOGS_SHOW_INDEX;
      break;
    case CareerGoals.getCollectionName():
      retval.type = SET_CAREER_GOALS_SHOW_INDEX;
      break;
    case CourseInstances.getCollectionName():
      retval.type = SET_COURSE_INSTANCES_SHOW_INDEX;
      break;
    case Courses.getCollectionName():
      retval.type = SET_COURSES_SHOW_INDEX;
      break;
    case DesiredDegrees.getCollectionName():
      retval.type = SET_DESIRED_DEGREES_SHOW_INDEX;
      break;
    case Feeds.getCollectionName():
      retval.type = SET_FEEDS_SHOW_INDEX;
      break;
    case FeedbackInstances.getCollectionName():
      retval.type = SET_FEEDBACK_INSTANCES_SHOW_INDEX;
      break;
    case HelpMessages.getCollectionName():
      retval.type = SET_HELP_MESSAGES_SHOW_INDEX;
      break;
    case Interests.getCollectionName():
      retval.type = SET_INTERESTS_SHOW_INDEX;
      break;
    case InterestTypes.getCollectionName():
      retval.type = SET_INTEREST_TYPES_SHOW_INDEX;
      break;
    case MentorAnswers.getCollectionName():
      retval.type = SET_MENTOR_ANSWERS_SHOW_INDEX;
      break;
    case MentorQuestions.getCollectionName():
      retval.type = SET_MENTOR_QUESTIONS_SHOW_INDEX;
      break;
    case Opportunities.getCollectionName():
      retval.type = SET_OPPORTUNITIES_SHOW_INDEX;
      break;
    case OpportunityInstances.getCollectionName():
      retval.type = SET_OPPORTUNITY_INSTANCES_SHOW_INDEX;
      break;
    case OpportunityTypes.getCollectionName():
      retval.type = SET_OPPORTUNITY_TYPES_SHOW_INDEX;
      break;
    case PlanChoices.getCollectionName():
      retval.type = SET_PLAN_CHOICES_SHOW_INDEX;
      break;
    case Reviews.getCollectionName():
      retval.type = SET_REVIEWS_SHOW_INDEX;
      break;
    case Slugs.getCollectionName():
      retval.type = SET_SLUGS_SHOW_INDEX;
      break;
    case AdvisorProfiles.getCollectionName():
      retval.type = SET_ADVISORS_SHOW_INDEX;
      break;
    case FacultyProfiles.getCollectionName():
      retval.type = SET_FACULTY_SHOW_INDEX;
      break;
    case MentorProfiles.getCollectionName():
      retval.type = SET_MENTORS_SHOW_INDEX;
      break;
    case StudentProfiles.getCollectionName():
      retval.type = SET_STUDENTS_SHOW_INDEX;
      break;
    case Teasers.getCollectionName():
      retval.type = SET_TEASERS_SHOW_INDEX;
      break;
    case VerificationRequests.getCollectionName():
      retval.type = SET_VERIFICATION_REQUESTS_SHOW_INDEX;
      break;
    default:
    // do nothing
  }
  return retval;
};
