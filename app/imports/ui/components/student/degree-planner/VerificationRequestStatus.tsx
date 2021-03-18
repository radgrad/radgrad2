import React from 'react';
import { Header, Card, List } from 'semantic-ui-react';
import moment from 'moment';

import { VerificationRequest } from '../../../../typings/radgrad';

interface VerificationRequestStatusProps {
  request: VerificationRequest;
}

const VerificationRequestStatus: React.FC<VerificationRequestStatusProps> = ({ request }) => {
  const whenSubmitted = moment(request.submittedOn).calendar();
  return (
    <Card.Content>
      <Header>Verification Status</Header>
      <span>
        <strong>Date Submitted:</strong> {whenSubmitted}
      </span>
      <br />
      <span>
        <strong>Status:</strong> {request.status}
      </span>
      <br />
      {request.processed.length > 0 ? (
        <React.Fragment>
          <strong>Documentation: </strong>
          <List bulleted>
            {request.processed.map((process, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <List.Item key={index}>
                <b>
                  ({process.status}) {moment(process.date).calendar()}
                </b>
                <br />
                By {process.verifier}
                {process.feedback ? (
                  <React.Fragment>
                    : <em>{process.feedback}</em>
                  </React.Fragment>
                ) : (
                  ''
                )}
              </List.Item>
            ))}
          </List>
        </React.Fragment>
      ) : (
        ''
      )}
    </Card.Content>
  );
};

export default VerificationRequestStatus;
