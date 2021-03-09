import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Button, Header, Icon } from 'semantic-ui-react';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { ChecklistState } from '../../../api/checklist/ChecklistState';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { StudentProfile } from '../../../typings/radgrad';
import {
  DEGREEPLANNER,
  STUDENT_VERIFICATION,
  URL_ROLES,
} from '../../layouts/utilities/route-constants';
import OpportunityList from '../shared/OpportunityList';
import { Checklist } from './Checklist';
import '../../../../client/style.css';

export class VerificationChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(name: string, student: string) {
    super(name);
    this.profile = Users.getProfile(student);
    // console.log('VerificationChecklist', this.profile, StudentProfiles.findDoc(student));
    this.updateState();
  }

  private getUnverifiedInstances() {
    const studentID = this.profile.userID;
    const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
    const ois = OpportunityInstances.findNonRetired({ studentID, verified: false });
    const oisInPast = _.filter(ois, (oi) => {
      const term = AcademicTerms.findDoc(oi.termID);
      return term.termNumber < currentTerm.termNumber;
    });
    const requests = VerificationRequests.findNonRetired({ studentID });
    const requestedOIs = requests.map((request) => request.opportunityInstanceID);
    const unverified = _.filter(oisInPast, (oi) => !_.includes(requestedOIs, oi._id));
    return unverified;
  }

  public updateState(): void {
    const unverified = this.getUnverifiedInstances();
    if (unverified.length > 0) {
      this.state = 'Improve';
    } else {
      this.state = 'Awesome';
    }
  }

  public getIcon(): string | JSX.Element {
    return <Icon name="check square" color="grey" /> ;
  }

  public getTitle(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Improve':
        return <Header as='h1'>You have <strong>Unverified Opportunities</strong> from a prior academic term</Header>;
      case 'Awesome':
        return <Header as='h1'>You do not have any <strong>Unverified Opportunities</strong></Header>;
      default:
        return <React.Fragment />;
    }
  }

  public getDescription(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Awesome':
        return <p>Congrats!  You do not have any Opportunities requiring verification at this time.</p>;
      case 'Improve':
        return <p>RadGrad requires an administrator to verify your participation in completed Opportunities in order to earn the Innovation and/or Experience points associated with it. By earning points, you can advance to new Levels, and RadGrad can make better recommendations due to a better understanding of your skills and experiences.</p>;
      default:
        return <React.Fragment />;
    }
  }

  public getDetails(state: ChecklistState): JSX.Element {
    const unverifiedInstances = this.getUnverifiedInstances();
    const unverifiedOpps = unverifiedInstances.map((oi) => Opportunities.findDoc(oi.opportunityID));
    switch (state) {
      case 'Improve':
        return <div className="highlightBox">
          <p>Your unverified Opportunities from a prior semester are:</p>
          <OpportunityList opportunities={unverifiedOpps} size="medium" keyStr="unverified" />
        </div>;
      default:
        return <React.Fragment />;
    }
  }

  public getActions(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Improve':
        return <div className="centeredBox"><p>Click &quot;Go to Verification Page&quot; to request verification of these Opportunities.  Click &quot;Go to Degree Planner&quot; to remove them from your plan if you didn&apos;t actually participate in one or more of these Opportunities.</p>
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${STUDENT_VERIFICATION}`}>Go To Verification Page</Button>&nbsp;&nbsp;
          <Button basic size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${DEGREEPLANNER}`}>Go To Degree Planner</Button>
</div>;
      default:
        return <React.Fragment />;
    }
  }
}
