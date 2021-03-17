import _ from 'lodash';
import { Opportunities } from './OpportunityCollection';
import { OpportunityInstances } from './OpportunityInstanceCollection';
import PreferredChoice from '../degree-plan/PreferredChoice';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { Users } from '../user/UserCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection';
import { getStudentsCurrentAcademicTermNumber } from '../degree-plan/AcademicYearUtilities';
import { profileGetInterestIDs } from '../../ui/components/shared/utilities/data-model';

/**
 * Returns a random int between min and max.
 * @param min the minimum value for the random number.
 * @param max the maximum value for the random number.
 * @return {*}
 * @memberOf api/opportunity
 */
export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min); // eslint-disable-line no-param-reassign
  max = Math.floor(max); // eslint-disable-line no-param-reassign
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Removes the planned Opportunities for the given studentID.
 * @param studentID
 * @memberOf api/opportunity
 */
export const clearPlannedOpportunityInstances = (studentID: string): void => {
  const ois = OpportunityInstances.find({ studentID, verified: false }).fetch();
  ois.forEach((oi) => {
    const requests = VerificationRequests.find({ studentID, opportunityInstanceID: oi._id }).fetch();
    if (requests.length === 0) {
      OpportunityInstances.removeIt(oi);
    }
  });
};

export const calculateOpportunityCompatibility = (opportunityID: string, studentID: string): number => {
  const course = Opportunities.findDoc(opportunityID);
  const profile = Users.getProfile(studentID);
  const studentInterests = profileGetInterestIDs(profile);
  const intersection = _.intersection(course.interestIDs, studentInterests);
  return intersection.length;
};

export const academicTermOpportunities = (academicTerm, academicTermNumber) => {
  const id = academicTerm._id;
  const opps = Opportunities.find().fetch();
  const academicTermOpps = opps.filter((opportunity) => _.indexOf(opportunity.termIDs, id) !== -1);
  if (academicTermNumber < 3) { // AY 1.
    return academicTermOpps.filter((opportunity) => {
      const type = Opportunities.getOpportunityTypeDoc(opportunity._id);
      return type.name === 'Club';
    });
  }
  if (academicTermNumber < 6) {
    return academicTermOpps.filter((opportunity) => {
      const type = Opportunities.getOpportunityTypeDoc(opportunity._id);
      return type.name === 'Event' || type.name === 'Club';
    });
  }
  return academicTermOpps;
};

export const getStudentAcademicTermOpportunityChoices = (academicTerm: string, academicTermNumber: number, studentID: string) => {
  const opportunities = academicTermOpportunities(academicTerm, academicTermNumber);
  const oppInstances = OpportunityInstances.find({ studentID }).fetch();
  const filtered = opportunities.filter((opp) => {
    let taken = true;
    oppInstances.forEach((oi) => {
      if (oi.opportunityID === opp._id) {
        taken = false;
      }
    });
    return taken;
  });
  return filtered;
};

export const chooseStudentAcademicTermOpportunity = (academicTerm: string, academicTermNumber: number, studentID: string) => {
  const choices = getStudentAcademicTermOpportunityChoices(academicTerm, academicTermNumber, studentID);
  const profile = Users.getProfile(studentID);
  const interestIDs = profileGetInterestIDs(profile);
  const preferred = new PreferredChoice(choices, interestIDs);
  const best = preferred.getBestChoices();
  if (best) {
    return best[getRandomInt(0, best.length)];
  }
  return null;
};

export const getStudentCurrentAcademicTermOpportunityChoices = (studentID: string) => {
  const currentAcademicTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const academicTermNum = getStudentsCurrentAcademicTermNumber(studentID);
  return getStudentAcademicTermOpportunityChoices(currentAcademicTerm, academicTermNum, studentID);
};

export const getRecommendedCurrentAcademicTermOpportunityChoices = (studentID: string) => {
  const choices = getStudentCurrentAcademicTermOpportunityChoices(studentID);
  const profile = Users.getProfile(studentID);
  const interestIDs = profileGetInterestIDs(profile);
  const preferred = new PreferredChoice(choices, interestIDs);
  const best = preferred.getBestChoices();
  return best;
};

export const chooseCurrentAcademicTermOpportunity = (studentID: string) => {
  const best = getRecommendedCurrentAcademicTermOpportunityChoices(studentID);
  if (best) {
    return best[getRandomInt(0, best.length)];
  }
  return null;
};
