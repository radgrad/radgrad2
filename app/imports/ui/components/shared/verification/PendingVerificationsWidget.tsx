import React from 'react';
import { Segment, Header, Container } from 'semantic-ui-react';
import { VerificationRequest } from '../../../../typings/radgrad';
import PendingVerificationItem from './PendingVerificationItem';

interface PendingVerificationsWidgetProps {
  pendingVerifications: VerificationRequest[];
}

/**
 * Component that naively displays a supplied array of **IVerificationRequests** and the UI for users to handle them.
 * The parent component is expected to handle permissions and filtering (role and status **are not checked** in this
 * component).
 * @param pendingVerifications {VerificationRequest[]}
 * @returns {Segment}
 */
const PendingVerificationsWidget: React.FC<PendingVerificationsWidgetProps> = ({ pendingVerifications }) => (
  <Segment>
    <Header as="h4" dividing content="PENDING VERIFICATION REQUESTS" />
    <Container fluid={false} style={{ paddingBottom: '14px' }}>
      {pendingVerifications.map((ele: VerificationRequest) => (
        <PendingVerificationItem verificationRequest={ele} key={ele._id} />
      ))}
      {pendingVerifications.length < 1 && <i>No pending requests.</i>}
    </Container>
  </Segment>
);

export default PendingVerificationsWidget;
