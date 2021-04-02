import React from 'react';
import { Header, Icon, Segment } from 'semantic-ui-react';
import { OpportunityInstance, VerificationRequest } from '../../../typings/radgrad';
import { CHECKSTATE } from '../checklist/Checklist';
import { VerificationChecklist } from '../checklist/VerificationChecklist';
import { opportunityIdToName } from '../shared/utilities/data-model';

interface StudentUnverifiedOpportunitiesProps {
  unVerifiedOpportunityInstances: OpportunityInstance[];
  verificationRequests: VerificationRequest[];
  student: string;
}

const StudentUnverifiedOpportunities: React.FC<StudentUnverifiedOpportunitiesProps> = ({
  unVerifiedOpportunityInstances,
  verificationRequests,
  student,
}) => {
  const checklist = new VerificationChecklist(student);

  return (
    <div id='student-unverified-opportunities'>
      <Segment>
        <Header>
          <p>
            <Icon name='checkmark box' color='grey' size='large' />Verifications
          {checklist.getState() === CHECKSTATE.IMPROVE ?
            <span style={{ float: 'right' }}><Icon name='exclamation triangle' color='red' /> {checklist.getTitleText()}</span> : ''}
          </p>
        </Header>
        {unVerifiedOpportunityInstances.map((oi) => <p>{opportunityIdToName(oi.opportunityID)}</p>)}
      </Segment>
    </div>
  );
};

export default StudentUnverifiedOpportunities;
