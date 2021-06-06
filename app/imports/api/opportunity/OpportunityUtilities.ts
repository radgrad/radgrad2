import _ from 'lodash';
import { Opportunities } from './OpportunityCollection';
import { OpportunityInstances } from './OpportunityInstanceCollection';
import { Users } from '../user/UserCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection';
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
