import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router-dom';
import {Button} from 'semantic-ui-react';
import {AcademicTerms} from '../../../api/academic-term/AcademicTermCollection';
import {Opportunities} from '../../../api/opportunity/OpportunityCollection';
import {OpportunityInstances} from '../../../api/opportunity/OpportunityInstanceCollection';
import {Users} from '../../../api/user/UserCollection';
import {VerificationRequests} from '../../../api/verification/VerificationRequestCollection';
import {StudentProfile} from '../../../typings/radgrad';
import {DEGREEPLANNER, STUDENT_VERIFICATION, URL_ROLES} from '../../layouts/utilities/route-constants';
import OpportunityList from '../shared/OpportunityList';
import {Checklist, CHECKSTATE} from './Checklist';
import '../../../../client/style.css';
import {DetailsBox} from "./DetailsBox";

export class VerificationChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(student: string) {
    super();
    this.name = 'Verifications';
    this.profile = Users.getProfile(student);
    this.iconName = 'check square';
    this.title[CHECKSTATE.OK] = 'You do not have any unverified Opportunities';
    this.title[CHECKSTATE.IMPROVE] = 'You have unverified Opportunities from a prior academic term';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = 'Congrats!  You do not have any Opportunities requiring verification at this time.';
    this.description[CHECKSTATE.IMPROVE] = `RadGrad requires an administrator to verify your participation in completed 
      Opportunities in order to earn the Innovation and/or Experience points associated with it. By earning points, 
      you can advance to new Levels, and RadGrad can make better recommendations due to a better understanding of your 
      skills and experiences.`;
    this.updateState();
  }

  private getUnverifiedInstances() {
    const studentID = this.profile.userID;
    const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
    const ois = OpportunityInstances.findNonRetired({studentID, verified: false});
    const oisInPast = _.filter(ois, (oi) => {
      const term = AcademicTerms.findDoc(oi.termID);
      return term.termNumber < currentTerm.termNumber;
    });
    const requests = VerificationRequests.findNonRetired({studentID});
    const requestedOIs = requests.map((request) => request.opportunityInstanceID);
    const unverified = _.filter(oisInPast, (oi) => !_.includes(requestedOIs, oi._id));
    return unverified;
  }

  public updateState(): void {
    const unverified = this.getUnverifiedInstances();
    if (unverified.length > 0) {
      this.state = CHECKSTATE.IMPROVE;
    } else {
      this.state = CHECKSTATE.OK;
    }
  }

  public getDetails(state: CHECKSTATE): JSX.Element {
    const unverifiedInstances = this.getUnverifiedInstances();
    const unverifiedOpps = unverifiedInstances.map((oi) => Opportunities.findDoc(oi.opportunityID));
    switch (state) {
      case CHECKSTATE.IMPROVE:
        return (
          <DetailsBox description='Your unverified Opportunities from a past semester are:'>
            <OpportunityList opportunities={unverifiedOpps} size="medium" keyStr="unverified"/>
          </DetailsBox>
        );
      default:
        return <React.Fragment/>;
    }
  }

  public getActions(state: CHECKSTATE): JSX.Element {
    switch (state) {
      case CHECKSTATE.IMPROVE:
        return <div className="centeredBox"><p>Click &quot;Go to Verification Page&quot; to request verification of these Opportunities. Click &quot;Go to Degree Planner&quot; to remove them from your plan if you didn&apos;t actually participate in
          one or more of these Opportunities.</p>
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${STUDENT_VERIFICATION}`}>Go To Verification Page</Button>&nbsp;&nbsp;
          <Button basic size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${DEGREEPLANNER}`}>Go To Degree Planner</Button>
        </div>;
      default:
        return <React.Fragment/>;
    }
  }
}
