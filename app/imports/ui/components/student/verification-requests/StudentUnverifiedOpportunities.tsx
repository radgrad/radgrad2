import React from 'react';
import { Card, Grid, Header, Icon, Segment, Tab } from 'semantic-ui-react';
import { VerificationRequestStatus } from '../../../../api/verification/VerificationRequestCollection';
import { OpportunityInstance, VerificationRequest } from '../../../../typings/radgrad';
import { CHECKSTATE } from '../../checklist/Checklist';
import { VerificationChecklist } from '../../checklist/VerificationChecklist';
import StudentPendingVerificationRequest from './StudentPendingVerificationRequest';
import StudentUnverifiedOpportunityItem from '../shared/StudentUnverifiedOpportunityItem';

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
  const pendingVRs = verificationRequests.filter((vr) => vr.status === VerificationRequestStatus.OPEN);
  const rejectedVRs = verificationRequests.filter((vr) => vr.status === VerificationRequestStatus.REJECTED);
  const panes = [
    {
      menuItem: `Unverified (${unVerifiedOpportunityInstances.length})`,
      render: () => (
        <Tab.Pane key={`Unverified (${unVerifiedOpportunityInstances.length})-pane`}>
          <Grid stackable>
            {unVerifiedOpportunityInstances.map((oi) => (
              <StudentUnverifiedOpportunityItem opportunityInstance={oi} key={oi._id} />))}
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: `Pending (${pendingVRs.length})`,
      render: () => (
        <Tab.Pane key={`Pending (${pendingVRs.length})`}>
          <Card.Group>
            {pendingVRs.map((vr) => (<Card>
              <StudentPendingVerificationRequest request={vr} key={vr._id} />
            </Card>))}
          </Card.Group>
        </Tab.Pane>
      ),
    },
    {
      menuItem: `Rejected (${rejectedVRs.length})`,
      render: () => (
        <Tab.Pane key={`Rejected (${rejectedVRs.length})`}>
          {rejectedVRs.map((vr) => vr.status)}
        </Tab.Pane>
      ),
    },
  ];
  return (
    <Segment>
      <Header dividing>
        <p>
          <Icon name='checkmark box' color='grey' size='large' />Verifications
          {checklist.getState() === CHECKSTATE.IMPROVE ?
            <span style={{ float: 'right' }}><Icon name='exclamation triangle' color='red' /> {checklist.getTitleText()}</span> : ''}
        </p>
      </Header>
      <Tab panes={panes} defaultActiveIndex={0} />
    </Segment>
  );
};

export default StudentUnverifiedOpportunities;
