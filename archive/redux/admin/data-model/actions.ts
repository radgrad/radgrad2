import { AdminProfiles } from '../../../../app/imports/api/user/AdminProfileCollection';
import * as TYPES from './types';
import { AcademicTerms } from '../../../../app/imports/api/academic-term/AcademicTermCollection';
import { AcademicYearInstances } from '../../../../app/imports/api/degree-plan/AcademicYearInstanceCollection';
import { CareerGoals } from '../../../../app/imports/api/career/CareerGoalCollection';
import { CourseInstances } from '../../../../app/imports/api/course/CourseInstanceCollection';
import { Courses } from '../../../../app/imports/api/course/CourseCollection';
import { Interests } from '../../../../app/imports/api/interest/InterestCollection';
import { InterestTypes } from '../../../../app/imports/api/interest/InterestTypeCollection';
import { Opportunities } from '../../../../app/imports/api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../../app/imports/api/opportunity/OpportunityInstanceCollection';
import { OpportunityTypes } from '../../../../app/imports/api/opportunity/OpportunityTypeCollection';
import { Reviews } from '../../../../app/imports/api/review/ReviewCollection';
import { Slugs } from '../../../../app/imports/api/slug/SlugCollection';
import { AdvisorProfiles } from '../../../../app/imports/api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../../app/imports/api/user/FacultyProfileCollection';
import { StudentProfiles } from '../../../../app/imports/api/user/StudentProfileCollection';
import { Teasers } from '../../../../app/imports/api/teaser/TeaserCollection';
import { VerificationRequests } from '../../../../app/imports/api/verification/VerificationRequestCollection';

export const setCollectionShowCount = (collectionName: string, count: number): { type?: string, payload?: number } => {
  const retVal: { type?: string, payload?: number } = {};
  retVal.payload = count;
  switch (collectionName) {
    case AcademicTerms.getCollectionName():
      retVal.type = TYPES.SET_ACADEMIC_TERMS_SHOW_COUNT;
      break;
    case AcademicYearInstances.getCollectionName():
      retVal.type = TYPES.SET_ACADEMIC_YEARS_SHOW_COUNT;
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

export const setCollectionShowIndex = (collectionName: string, index: number): { type?: string, payload?: number } => {
  const retVal: { type?: string, payload?: number } = {};
  retVal.payload = index;
  switch (collectionName) {
    case AcademicTerms.getCollectionName():
      retVal.type = TYPES.SET_ACADEMIC_TERMS_SHOW_INDEX;
      break;
    case AcademicYearInstances.getCollectionName():
      retVal.type = TYPES.SET_ACADEMIC_YEARS_SHOW_INDEX;
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

export const setUploadFixtureWorking = (working: boolean): { type?: string, payload?: boolean } => {
  const retVal: { type?: string, payload?: boolean } = {};
  retVal.payload = working;
  if (working) {
    retVal.type = TYPES.SET_UPLOAD_FIXTURE_WORKING;
  } else {
    retVal.type = TYPES.SET_UPLOAD_FIXTURE_DONE;
  }
  return retVal;
};
