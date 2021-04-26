import React from 'react';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import { DEGREEPLANNER, STUDENT_VERIFICATION, URL_ROLES } from '../../layouts/utilities/route-constants';
import OpportunityList from '../shared/OpportunityList';
import { Checklist, CHECKSTATE } from './Checklist';
import { DetailsBox } from './DetailsBox';
import { ActionsBox } from './ActionsBox';
import { ChecklistButtonLink } from './ChecklistButtons';

export class VerificationChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(student: string) {
    super();
    this.name = 'Verifications';
    this.profile = Users.getProfile(student);
    this.iconName = 'check square';
    this.title[CHECKSTATE.OK] = 'All completed Opportunities are verified';
    this.title[CHECKSTATE.IMPROVE] = 'You have unverified Opportunities from a prior term';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = 'Congrats!  You have no Opportunities requiring verification.';
    this.description[CHECKSTATE.IMPROVE] = `RadGrad requires an administrator to verify your participation in completed 
      Opportunities in order to earn the Innovation and/or Experience points associated with it. By earning points, 
      you can advance to new Levels, and RadGrad can make better recommendations due to a better understanding of your 
      skills and experiences.`;
    this.updateState();
  }

  public updateState(): void {
    const unverified = OpportunityInstances.getUnverifiedInstances(this.profile.userID);
    if (unverified.length > 0) {
      this.state = CHECKSTATE.IMPROVE;
    } else {
      this.state = CHECKSTATE.OK;
    }
  }

  public getDetails(): JSX.Element {
    const unverifiedInstances = OpportunityInstances.getUnverifiedInstances(this.profile.userID);
    const unverifiedOpps = unverifiedInstances.map((oi) => Opportunities.findDoc(oi.opportunityID));
    switch (this.state) {
      case CHECKSTATE.IMPROVE:
        return (
          <DetailsBox description='Your unverified Opportunities from a past semester are:'>
            <OpportunityList opportunities={unverifiedOpps} size="medium" keyStr="unverified" userID={this.profile.userID} />
          </DetailsBox>
        );
      default:
        return <React.Fragment/>;
    }
  }

  public getActions(): JSX.Element {
    switch (this.state) {
      case CHECKSTATE.IMPROVE:
        return (
          <ActionsBox description='Use the Verification page to request verification of your completed Opportunities. Use the Degree Planner page to remove them from your plan if you didn&quot;t actually participate in them.' >
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${STUDENT_VERIFICATION}`} label='Verification Page'/>
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${DEGREEPLANNER}`} label='Degree Planner'/>
          </ActionsBox>
        );
      case CHECKSTATE.OK:
        return (
          <ActionsBox description='Use the Verification page to see verified Opportunities.' >
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${STUDENT_VERIFICATION}`} label='Verification Page'/>
          </ActionsBox>
        );
      default:
        return <React.Fragment/>;
    }
  }
}
