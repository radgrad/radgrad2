import React, { useState } from 'react';
import { Segment, Header, Grid, Container, Form } from 'semantic-ui-react';
import moment from 'moment';
/* eslint-disable no-unused-vars */
import {
  IAcademicTerm,
  IOpportunity,
  IProcessed,
  IVerificationRequest,
} from '../../../typings/radgrad';
/* eslint-enable no-unused-vars */
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { processPendingVerificationMethod } from '../../../api/verification/VerificationRequestCollection.methods';
import { updateLevelMethod } from '../../../api/level/LevelProcessor.methods';

interface IPendingVerificationsWidgetProps {
  pendingVerifications: IVerificationRequest[];
}

/**
 * Component that naively displays a supplied array of **IVerificationRequests** and the UI for users to handle them.
 * The parent component is expected to handle permissions and filtering (role and status **are not checked** in this
 * component).
 * @param pendingVerifications {IVerificationRequest[]}
 * @returns {Segment}
 */
const PendingVerificationsWidget = (props: IPendingVerificationsWidgetProps) => {
  let cachedStudent;
  let cachedSponsor;
  const [feedbackState, setFeedback] = useState([]);

  const buildHeaderString = (verificationRequest: IVerificationRequest) => {
    const id = verificationRequest._id;
    const opp: IOpportunity = VerificationRequests.getOpportunityDoc(id);
    const term: IAcademicTerm = VerificationRequests.getAcademicTermDoc(id);
    return `${opp.name}, ${term.term} ${term.year}`;
  };

  const studentProfile = (verificationRequest: IVerificationRequest) => {
    const id = verificationRequest._id;
    const cStudent = VerificationRequests.getStudentDoc(id);
    cachedStudent = cStudent;
    return cachedStudent;
  };

  const sponsorProfile = (verificationRequest: IVerificationRequest) => {
    const id = verificationRequest._id;
    const cSponsor = VerificationRequests.getSponsorDoc(id);
    cachedSponsor = cSponsor;
    return cachedSponsor;
  };

  const handleChange = (e, { index, value }) => {
    const fields = feedbackState;
    fields[index] = value;
    setFeedback(fields);
  };

  const handleForm = (e, { id, command, index, student }) => {
    const feedback = feedbackState[index];
    processPendingVerificationMethod.call({ verificationRequestID: id, command, feedback }, (error, result) => {
      if (result) {
        updateLevelMethod.call({ studentID: student.userID }, err => {
          if (err) {
            console.error((`Error updating ${student._id} level ${err.message}`));
          }
        });
        // eslint-disable-next-line react/no-access-state-in-setstate
        const fields = feedbackState;
        fields[index] = '';
        setFeedback(fields);
      }
    });
  };

  return (
    <Segment>
      <Header as="h4" dividing content="PENDING VERIFICATION REQUESTS" />
      <Container fluid={false} style={{ paddingBottom: '14px' }}>
        {props.pendingVerifications.map((ele: IVerificationRequest, i) => (
          <Grid key={ele._id}>
            <Grid.Row style={{ paddingBottom: '0px', paddingLeft: '14px' }}>
              <Header as="h3">{buildHeaderString(ele)}</Header>
            </Grid.Row>
            <Grid.Row columns={2} style={{ paddingTop: '0px', paddingBottom: '0px' }}>
              <Grid.Column>
                Student:
                {' '}
                {studentProfile(ele).firstName}
                {' '}
                {cachedStudent.lastName}
                <br />
                Sponsor:
                {' '}
                {sponsorProfile(ele).firstName}
                {' '}
                {cachedSponsor.lastName}
                <br />
                <Form style={{ paddingTop: '14px' }}>
                  <Form.Input
                    placeholder="Optional feedback"
                    index={i}
                    onChange={handleChange}
                    value={feedbackState[i] || ''}
                  />
                  <Form.Group inline>
                    <Form.Button
                      basic
                      compact
                      color="green"
                      content="Accept"
                      type="submit"
                      index={i}
                      command={VerificationRequests.ACCEPTED}
                      onClick={handleForm}
                      student={cachedStudent}
                      id={ele._id}
                    />
                    <Form.Button
                      basic
                      compact
                      color="red"
                      content="Decline"
                      type="submit"
                      index={i}
                      command={VerificationRequests.REJECTED}
                      onClick={handleForm}
                      student={cachedStudent}
                      id={ele._id}
                    />
                  </Form.Group>
                </Form>
              </Grid.Column>
              <Grid.Column>
                {`Submitted: ${moment(ele.submittedOn).calendar()}`}
                <br />
                {ele.processed.map((elem: IProcessed, ind) => (
                  <React.Fragment key={elem.verifier}>
                    Processed:
                    {' '}
                    {moment(elem.date).calendar()}
                    {' '}
                    by
                    {' '}
                    {elem.verifier}
                    {' '}
                    (
                    {elem.status}
                    {elem.feedback ? `, ${elem.feedback}` : ''}
                    )
                    <br />
                  </React.Fragment>
                ))}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        ))}
        {props.pendingVerifications.length < 1 && <i>No pending requests.</i>}
      </Container>
    </Segment>
  );
};

export default PendingVerificationsWidget;
