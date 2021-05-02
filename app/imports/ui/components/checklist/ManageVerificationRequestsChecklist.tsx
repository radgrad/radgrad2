import React from 'react';
import { Users } from '../../../api/user/UserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { AdvisorOrFacultyProfile } from '../../../typings/radgrad';
import { MANAGE } from '../../layouts/utilities/route-constants';
import { Checklist, CHECKSTATE } from './Checklist';
import { ActionsBox } from './ActionsBox';
import { ChecklistButtonLink } from './ChecklistButtons';

export class ManageVerificationRequestsChecklist extends Checklist {
  private profile: AdvisorOrFacultyProfile;

  constructor(username: string) {
    super();
    this.name = 'Manage Verification Requests';
    this.profile = Users.getProfile(username);
    this.role = this.profile.role;
    this.iconName = 'check square';
    this.title[CHECKSTATE.OK] = 'Thanks! There are no pending verification requests';
    this.title[CHECKSTATE.IMPROVE] = 'Please process the pending verification requests';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = 'Thanks, for processing the pending verification requests.';
    this.description[CHECKSTATE.IMPROVE] = `RadGrad is designed to support well rounded students. 
    Part of that is offering extracurricular opportunities and verifying participation.
    There are pending verification requests.`;

    this.updateState();
  }

  public updateState(): void {
    const unverified = VerificationRequests.findNonRetired({ status: VerificationRequests.OPEN });
    if (unverified.length > 0) {
      this.state = CHECKSTATE.IMPROVE;
    } else {
      this.state = CHECKSTATE.OK;
    }
  }
  public getActions(): JSX.Element {
    switch (this.state) {
      case CHECKSTATE.REVIEW:
      case CHECKSTATE.OK:
      case CHECKSTATE.IMPROVE:
        return (
          <ActionsBox description='Use the Manage Verification page to process verification requests:'>
            <ChecklistButtonLink url={`/${this.role.toLowerCase()}/${this.profile.username}/${MANAGE.VERIFICATION}`} label='Manage Verification Page'/>
          </ActionsBox>
        );
      default:
        return <React.Fragment />;
    }
  }
}
