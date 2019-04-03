import {
  SET_ACADEMIC_PLANS_SHOW_COUNT,
  SET_ACADEMIC_PLANS_SHOW_INDEX,
  SET_ACADEMIC_TERMS_SHOW_COUNT,
  SET_ACADEMIC_TERMS_SHOW_INDEX,
  SET_ACADEMIC_YEARS_SHOW_COUNT,
  SET_ACADEMIC_YEARS_SHOW_INDEX,
  SET_ADVISOR_LOGS_SHOW_COUNT,
  SET_ADVISOR_LOGS_SHOW_INDEX,
} from './paginationActionTypes';
import { AcademicYearInstances } from '../../api/degree-plan/AcademicYearInstanceCollection';
import { AcademicPlans } from '../../api/degree-plan/AcademicPlanCollection';
import { AcademicTerms } from '../../api/academic-term/AcademicTermCollection';
import { AdvisorLogs } from '../../api/log/AdvisorLogCollection';

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
