import React from 'react';
import { Card } from 'semantic-ui-react';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { VerificationRequest } from '../../../../typings/radgrad';
import IceHeader from '../../shared/IceHeader';
import VerificationRequestStatus from '../degree-planner/VerificationRequestStatus';

interface StudentPendingVerificationRequestProps {
  request: VerificationRequest;
}

const StudentPendingVerificationRequest: React.FC<StudentPendingVerificationRequestProps> = ({ request }) => {
  const oi = OpportunityInstances.findDoc(request.opportunityInstanceID);
  const termName = AcademicTerms.getShortName(oi.termID);
  const opportunity = Opportunities.findDoc(oi.opportunityID);
  const style = {
    marginLeft: 10,
  };
  return (
    <Card key={request._id}>
      <Card.Content>
        <IceHeader ice={opportunity.ice} />
        <Card.Header>{opportunity.name}</Card.Header>
        <p style={style}>
          <b>Participated:</b> {termName}
        </p>
        <VerificationRequestStatus request={request} />
      </Card.Content>
    </Card>
  );
};

export default StudentPendingVerificationRequest;
