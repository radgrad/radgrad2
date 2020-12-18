import { AdminProfiles } from '../../../api/user/AdminProfileCollection';
import * as TYPES from './types';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';

export const setCollectionShowCount = (collectionName: string, count: number) => {
  const retVal: { type?: string, payload?: number } = {};
  retVal.payload = count;
  switch (collectionName) {
    case AcademicTerms.getCollectionName():
      retVal.type = TYPES.SET_ACADEMIC_TERMS_SHOW_COUNT;
      break;
    case AcademicYearInstances.getCollectionName():
      retVal.type = TYPES.SET_ACADEMIC_YEARS_SHOW_COUNT;
      break;
    case AdvisorLogs.getCollectionName():
      retVal.type = TYPES.SET_ADVISOR_LOGS_SHOW_COUNT;
      break;
    case CareerGoals.getCollectionName():
      retVal.type = TYPES.SET_CAREER_GOALS_SHOW_COUNT;
      break;
    case CourseInstances.getCollectionName():
      retVal.type = TYPES.SET_COURSE_INSTANCES_SHOW_COUNT;
      break;
    case Courses.getCollectionName():
      retVal.type = TYPES.SET_COURSES_SHOW_COUNT;
      break;
    case Feeds.getCollectionName():
      retVal.type = TYPES.SET_FEEDS_SHOW_COUNT;
      break;
    case FeedbackInstances.getCollectionName():
      retVal.type = TYPES.SET_FEEDBACK_INSTANCES_SHOW_COUNT;
      break;
    case HelpMessages.getCollectionName():
      retVal.type = TYPES.SET_HELP_MESSAGES_SHOW_COUNT;
      break;
    case Interests.getCollectionName():
      retVal.type = TYPES.SET_INTERESTS_SHOW_COUNT;
      break;
    case InterestTypes.getCollectionName():
      retVal.type = TYPES.SET_INTEREST_TYPES_SHOW_COUNT;
      break;
    case Opportunities.getCollectionName():
      retVal.type = TYPES.SET_OPPORTUNITIES_SHOW_COUNT;
      break;
    case OpportunityInstances.getCollectionName():
      retVal.type = TYPES.SET_OPPORTUNITY_INSTANCES_SHOW_COUNT;
      break;
    case OpportunityTypes.getCollectionName():
      retVal.type = TYPES.SET_OPPORTUNITY_TYPES_SHOW_COUNT;
      break;
    case Reviews.getCollectionName():
      retVal.type = TYPES.SET_REVIEWS_SHOW_COUNT;
      break;
    case Slugs.getCollectionName():
      retVal.type = TYPES.SET_SLUGS_SHOW_COUNT;
      break;
    case AdminProfiles.getCollectionName():
      retVal.type = TYPES.SET_ADMINS_SHOW_COUNT;
      break;
    case AdvisorProfiles.getCollectionName():
      retVal.type = TYPES.SET_ADVISORS_SHOW_COUNT;
      break;
    case FacultyProfiles.getCollectionName():
      retVal.type = TYPES.SET_FACULTY_SHOW_COUNT;
      break;
    case StudentProfiles.getCollectionName():
      retVal.type = TYPES.SET_STUDENTS_SHOW_COUNT;
      break;
    case Teasers.getCollectionName():
      retVal.type = TYPES.SET_TEASERS_SHOW_COUNT;
      break;
    case VerificationRequests.getCollectionName():
      retVal.type = TYPES.SET_VERIFICATION_REQUESTS_SHOW_COUNT;
      break;
    default:
      break;
  }
  return retVal;
};

export const setCollectionShowIndex = (collectionName: string, index: number) => {
  const retVal: { type?: string, payload?: number } = {};
  retVal.payload = index;
  switch (collectionName) {
    case AcademicTerms.getCollectionName():
      retVal.type = TYPES.SET_ACADEMIC_TERMS_SHOW_INDEX;
      break;
    case AcademicYearInstances.getCollectionName():
      retVal.type = TYPES.SET_ACADEMIC_YEARS_SHOW_INDEX;
      break;
    case AdvisorLogs.getCollectionName():
      retVal.type = TYPES.SET_ADVISOR_LOGS_SHOW_INDEX;
      break;
    case CareerGoals.getCollectionName():
      retVal.type = TYPES.SET_CAREER_GOALS_SHOW_INDEX;
      break;
    case CourseInstances.getCollectionName():
      retVal.type = TYPES.SET_COURSE_INSTANCES_SHOW_INDEX;
      break;
    case Courses.getCollectionName():
      retVal.type = TYPES.SET_COURSES_SHOW_INDEX;
      break;
    case Feeds.getCollectionName():
      retVal.type = TYPES.SET_FEEDS_SHOW_INDEX;
      break;
    case FeedbackInstances.getCollectionName():
      retVal.type = TYPES.SET_FEEDBACK_INSTANCES_SHOW_INDEX;
      break;
    case HelpMessages.getCollectionName():
      retVal.type = TYPES.SET_HELP_MESSAGES_SHOW_INDEX;
      break;
    case Interests.getCollectionName():
      retVal.type = TYPES.SET_INTERESTS_SHOW_INDEX;
      break;
    case InterestTypes.getCollectionName():
      retVal.type = TYPES.SET_INTEREST_TYPES_SHOW_INDEX;
      break;
    case Opportunities.getCollectionName():
      retVal.type = TYPES.SET_OPPORTUNITIES_SHOW_INDEX;
      break;
    case OpportunityInstances.getCollectionName():
      retVal.type = TYPES.SET_OPPORTUNITY_INSTANCES_SHOW_INDEX;
      break;
    case OpportunityTypes.getCollectionName():
      retVal.type = TYPES.SET_OPPORTUNITY_TYPES_SHOW_INDEX;
      break;
    case Reviews.getCollectionName():
      retVal.type = TYPES.SET_REVIEWS_SHOW_INDEX;
      break;
    case Slugs.getCollectionName():
      retVal.type = TYPES.SET_SLUGS_SHOW_INDEX;
      break;
    case AdminProfiles.getCollectionName():
      retVal.type = TYPES.SET_ADMINS_SHOW_INDEX;
      break;
    case AdvisorProfiles.getCollectionName():
      retVal.type = TYPES.SET_ADVISORS_SHOW_INDEX;
      break;
    case FacultyProfiles.getCollectionName():
      retVal.type = TYPES.SET_FACULTY_SHOW_INDEX;
      break;
    case StudentProfiles.getCollectionName():
      retVal.type = TYPES.SET_STUDENTS_SHOW_INDEX;
      break;
    case Teasers.getCollectionName():
      retVal.type = TYPES.SET_TEASERS_SHOW_INDEX;
      break;
    case VerificationRequests.getCollectionName():
      retVal.type = TYPES.SET_VERIFICATION_REQUESTS_SHOW_INDEX;
      break;
    default:
      break;
  }
  return retVal;
};

export const setUploadFixtureWorking = (working: boolean) => {
  const retVal: { type?: string, payload?: boolean } = {};
  retVal.payload = working;
  if (working) {
    retVal.type = TYPES.SET_UPLOAD_FIXTURE_WORKING;
  } else {
    retVal.type = TYPES.SET_UPLOAD_FIXTURE_DONE;
  }
  return retVal;
};
