import * as React from 'react';
import * as _ from 'lodash';
import { Divider, Header } from 'semantic-ui-react';
import * as moment from 'moment';

import { IVerificationRequest } from '../../../typings/radgrad';

interface IVerificationRequestStatusProps {
  request: IVerificationRequest;
}

const VerificationRequestStatus = (props: IVerificationRequestStatusProps) => {
  // console.log('Verification Request Status', props);
  const whenSubmitted = moment(props.request.submittedOn).calendar();
  return (
    <React.Fragment>
      <Divider/>
      <Header>REQUEST STATUS</Header>
      <span><strong>Date Submitted:</strong> {whenSubmitted}</span>
      <span><strong>Status:</strong> {props.request.status}</span>
      <strong>Documentation:</strong>  <br/>
      {_.map(props.request.processed, (process, index) => (<div key={index}>Processed: {moment(process.date).calendar()} by {process.verifier}:
        &nbsp;{process.status} <em>{process.feedback}</em></div>))}
    </React.Fragment>
  );
};

export default VerificationRequestStatus;
