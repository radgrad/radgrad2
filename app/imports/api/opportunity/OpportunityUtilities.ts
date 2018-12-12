import { _ } from 'meteor/erasaur:meteor-lodash';
import { Opportunities } from './OpportunityCollection';
import { OpportunityInstances } from './OpportunityInstanceCollection';
import PreferredChoice from '../degree-plan/PreferredChoice';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { Users } from '../user/UserCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection';
import { getStudentsCurrentAcademicTermNumber } from '../degree-plan/AcademicYearUtilities';
import { number } from 'prop-types';

/**
 * Returns a random int between min and max.
 * @param min the minimum value for the random number.
 * @param max the maximum value for the random number.
 * @return {*}
 * @memberOf api/opportunity
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);  // tslint:disable-line: no-parameter-reassignment
  max = Math.floor(max);  // tslint:disable-line: no-parameter-reassignment
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Removes the planned Opportunities for the given studentID.
 * @param studentID
 * @memberOf api/opportunity
 */
export function clearPlannedOpportunityInstances(studentID: string) {
  const courses = OpportunityInstances.find({ studentID, verified: false }).fetch();
  _.forEach(courses, (oi) => {
    const requests = VerificationRequests.find({ studentID, opportunityInstanceID: oi._id }).fetch();
    if (requests.length === 0) {
      OpportunityInstances.removeIt(oi);
    }
  });
}

export function calculateOpportunityCompatibility(opportunityID: string, studentID: string) {
  const course = Opportunities.findDoc(opportunityID);
  const studentInterests = Users.getProfile(studentID).interestIDs;
  const intersection = _.intersection(course.interestIDs, studentInterests);
  return intersection.length;
}

export function academicTermOpportunities(academicTerm, academicTermNumber) {
  const id = academicTerm._id;
  const opps = Opportunities.findNonRetired();
  const academicTermOpps = _.filter(opps, (opportunity) => {
    return _.indexOf(opportunity.termIDs, id) !== -1;
  });
  if (academicTermNumber < 3) { // AY 1.
    return _.filter(academicTermOpps, (opportunity) => {
      const type = Opportunities.getOpportunityTypeDoc(opportunity._id);
      return type.name === 'Club';
    });
  }
  if (academicTermNumber < 6) {
    return _.filter(academicTermOpps, (opportunity) => {
      const type = Opportunities.getOpportunityTypeDoc(opportunity._id);
      return type.name === 'Event' || type.name === 'Club';
    });
  }
  return academicTermOpps;
}

export function getStudentAcademicTermOpportunityChoices(academicTerm: string, academicTermNumber: number, studentID: string) {
  const opportunities = academicTermOpportunities(academicTerm, academicTermNumber);
  const oppInstances = OpportunityInstances.find({ studentID }).fetch();
  const filtered = _.filter(opportunities, (opp) => {
    let taken = true;
    _.forEach(oppInstances, (oi) => {
      if (oi.opportunityID === opp._id) {
        taken = false;
      }
    });
    return taken;
  });
  return filtered;
}

export function chooseStudentAcademicTermOpportunity(academicTerm: string, academicTermNumber: number, studentID: string) {
  const choices = getStudentAcademicTermOpportunityChoices(academicTerm, academicTermNumber, studentID);
  const interestIDs = Users.getProfile(studentID).interestIDs;
  const preferred = new PreferredChoice(choices, interestIDs);
  const best = preferred.getBestChoices();
  if (best) {
    return best[getRandomInt(0, best.length)];
  }
  return null;
}

export function getStudentCurrentAcademicTermOpportunityChoices(studentID: string) {
  const currentAcademicTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const academicTermNum = getStudentsCurrentAcademicTermNumber(studentID);
  return getStudentAcademicTermOpportunityChoices(currentAcademicTerm, academicTermNum, studentID);
}

export function getRecommendedCurrentAcademicTermOpportunityChoices(studentID) {
  const choices = getStudentCurrentAcademicTermOpportunityChoices(studentID);
  const interestIDs = Users.getProfile(studentID).interestIDs;
  const preferred = new PreferredChoice(choices, interestIDs);
  const best = preferred.getBestChoices();
  return best;
}

export function chooseCurrentAcademicTermOpportunity(studentID: string) {
  const best = getRecommendedCurrentAcademicTermOpportunityChoices(studentID);
  if (best) {
    return best[getRandomInt(0, best.length)];
  }
  return null;
}
