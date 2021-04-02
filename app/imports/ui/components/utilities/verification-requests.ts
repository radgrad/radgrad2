import _ from 'lodash';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { OpportunityInstance } from '../../../typings/radgrad';

export const getUnverifiedInstances = (studentID: string): OpportunityInstance[] => {
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const ois = OpportunityInstances.findNonRetired({ studentID, verified: false });
  const oisInPast = ois.filter((oi) => {
    const term = AcademicTerms.findDoc(oi.termID);
    return term.termNumber < currentTerm.termNumber;
  });
  const requests = VerificationRequests.findNonRetired({ studentID });
  const requestedOIs = requests.map((request) => request.opportunityInstanceID);
  const unverified = oisInPast.filter((oi) => !_.includes(requestedOIs, oi._id));
  return unverified;
};
