import React, { useState } from 'react';
import { Header, Grid, Form } from 'semantic-ui-react';
import moment from 'moment';
import { AcademicTerm, Opportunity, Processed, VerificationRequest } from '../../../../typings/radgrad';
import { VerificationRequests } from '../../../../api/verification/VerificationRequestCollection';
import { processPendingVerificationMethod } from '../../../../api/verification/VerificationRequestCollection.methods';
import { updateLevelMethod } from '../../../../api/level/LevelProcessor.methods';

interface PendingVerificationItemProps {
  verificationRequest: VerificationRequest;
}

const PendingVerificationItem: React.FC<PendingVerificationItemProps> = ({ verificationRequest }) => {
  const [feedbackState, setFeedback] = useState('');
  const studentProfile = VerificationRequests.getStudentDoc(verificationRequest._id);
  const sponsorProfile = VerificationRequests.getSponsorDoc(verificationRequest._id);

  const buildHeaderString = () => {
    const id = verificationRequest._id;
    const opp: Opportunity = VerificationRequests.getOpportunityDoc(id);
    const term: AcademicTerm = VerificationRequests.getAcademicTermDoc(id);
    return `${opp.name}, ${term.term} ${term.year}`;
  };

  const handleChange = (e, { value }) => {
    setFeedback(value);
  };

  const handleForm = (e, { id, command, student }) => {
    const feedback = feedbackState;
    processPendingVerificationMethod.callPromise({ verificationRequestID: id, command, feedback }).then(() => {
      updateLevelMethod.callPromise({ studentID: student.userID }).catch((err) => console.error(`Error updating ${student._id} level ${err.message}`));
    });
  };

  return (
    <Grid key={verificationRequest._id}>
      <Grid.Row style={{ paddingBottom: '0px', paddingLeft: '14px' }}>
        <Header as="h3">{buildHeaderString()}</Header>
      </Grid.Row>
      <Grid.Row columns={2} style={{ paddingTop: '0px', paddingBottom: '0px' }}>
        <Grid.Column>
          Student: {studentProfile.firstName} {studentProfile.lastName}
          <br />
          Sponsor: {sponsorProfile.firstName} {sponsorProfile.lastName}
          <br />
          Justification: {verificationRequest.documentation}
          <Form style={{ paddingTop: '14px' }}>
            <Form.Input placeholder="Optional feedback" onChange={handleChange} value={feedbackState} />
            <Form.Group inline>
              <Form.Button basic compact color="green" content="Accept" type="submit" command={VerificationRequests.ACCEPTED} onClick={handleForm} student={studentProfile} id={verificationRequest._id} />
              <Form.Button basic compact color="red" content="Decline" type="submit" command={VerificationRequests.REJECTED} onClick={handleForm} student={studentProfile} id={verificationRequest._id} />
            </Form.Group>
          </Form>
        </Grid.Column>
        <Grid.Column>
          {`Submitted: ${moment(verificationRequest.submittedOn).calendar()}`}
          <br />
          {verificationRequest.processed.map((verificationRequestm: Processed, ind) => (
            <React.Fragment key={`${verificationRequestm.verifier}${verificationRequestm.date}`}>
              Processed: {moment(verificationRequestm.date).calendar()} by {verificationRequestm.verifier} ({verificationRequestm.status}
              {verificationRequestm.feedback ? `, ${verificationRequestm.feedback}` : ''})
              <br />
            </React.Fragment>
          ))}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default PendingVerificationItem;
