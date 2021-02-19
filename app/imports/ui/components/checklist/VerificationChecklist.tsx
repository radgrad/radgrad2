import _ from 'lodash';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { StudentProfile } from '../../../typings/radgrad';
import { Checklist } from './Checklist';

export class VerificationChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(name: string, student: string) {
    super(name);
    this.profile = Users.getProfile(student);
    // console.log('VerificationChecklist', this.profile, StudentProfiles.findDoc(student));
    this.updateState();
  }

  public updateState(): void {
    const studentID = this.profile.userID;
    const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
    const ois = OpportunityInstances.findNonRetired({ studentID, verified: false });
    const oisInPast = _.filter(ois, (oi) => {
      const term = AcademicTerms.findDoc(oi.termID);
      return term.termNumber < currentTerm.termNumber;
    });
    console.log(oisInPast);
    const requests = VerificationRequests.findNonRetired({ studentID });
    const requestedOIs = requests.map((request) => request.opportunityInstanceID);
    console.log(requestedOIs);
    const unverified = _.filter(oisInPast, (oi) => !_.includes(requestedOIs, oi._id));
    console.log(unverified);
    if (unverified.length > 0) {
      this.state = 'Improve';
    } else {
      this.state = 'OK';
    }
  }

}
