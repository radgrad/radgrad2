import {
  SET_ACADEMIC_PLANS_SHOW_COUNT,
  SET_ACADEMIC_PLANS_SHOW_INDEX,
  SET_ACADEMIC_TERMS_SHOW_COUNT,
  SET_ACADEMIC_TERMS_SHOW_INDEX,
  SET_ACADEMIC_YEARS_SHOW_COUNT,
  SET_ACADEMIC_YEARS_SHOW_INDEX,
  SET_ADVISOR_LOGS_SHOW_COUNT,
  SET_ADVISOR_LOGS_SHOW_INDEX,
  SET_CAREER_GOALS_SHOW_COUNT,
  SET_COURSE_INSTANCES_SHOW_COUNT,
  SET_COURSES_SHOW_COUNT,
  SET_DESIRED_DEGREES_SHOW_COUNT,
} from './paginationActionTypes';
import { AcademicYearInstances } from '../../api/degree-plan/AcademicYearInstanceCollection';
import { AcademicPlans } from '../../api/degree-plan/AcademicPlanCollection';
import { AcademicTerms } from '../../api/academic-term/AcademicTermCollection';
import { AdvisorLogs } from '../../api/log/AdvisorLogCollection';
import { CareerGoals } from '../../api/career/CareerGoalCollection';
import { CourseInstances } from '../../api/course/CourseInstanceCollection';
import { Courses } from '../../api/course/CourseCollection';
import { DesiredDegrees } from '../../api/degree-plan/DesiredDegreeCollection';

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
    default:
    // do nothing
  }
  return retval;
};
