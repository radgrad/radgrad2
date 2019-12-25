import React from 'react';
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

interface IPendingVerificationWidgetState {
  feedback: string[];
}
/**
 * Component that naively displays a supplied array of **IVerificationRequests** and the UI for users to handle them.
 * The parent component is expected to handle permissions and filtering (role and status **are not checked** in this
 * component).
 * @param pendingVerifications {IVerificationRequest[]}
 * @returns {Segment}
 */
class PendingVerificationsWidget extends React.Component<IPendingVerificationsWidgetProps, IPendingVerificationWidgetState> {
  cachedStudent = undefined;
  cachedSponsor = undefined;

  constructor(props) {
    super(props);
    this.state = { feedback: [] };
  }

  buildHeaderString = (verificationRequest: IVerificationRequest) => {
    const id = verificationRequest._id;
    const opp: IOpportunity = VerificationRequests.getOpportunityDoc(id);
    const term: IAcademicTerm = VerificationRequests.getAcademicTermDoc(id);
    return `${opp.name}, ${term.term} ${term.year}`;
  }

  studentProfile = (verificationRequest: IVerificationRequest) => {
    const id = verificationRequest._id;
    const cachedStudent = VerificationRequests.getStudentDoc(id);
    this.cachedStudent = cachedStudent;
    return cachedStudent;
  }

  sponsorProfile = (verificationRequest: IVerificationRequest) => {
    const id = verificationRequest._id;
    const cachedSponsor = VerificationRequests.getSponsorDoc(id);
    this.cachedSponsor = cachedSponsor;
    return cachedSponsor;
  }

  handleChange = (e, { index, value }) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const fields = this.state.feedback;
    fields[index] = value;
    this.setState({ feedback: fields });
  }

  handleForm = (e, { id, command, index, student }) => {
    const feedback = this.state.feedback[index];
    processPendingVerificationMethod.call({ verificationRequestID: id, command, feedback }, (error, result) => {
      if (result) {
        updateLevelMethod.call({ studentID: student.userID }, err => {
          if (err) { console.error((`Error updating ${student._id} level ${err.message}`)); }
        });
        // eslint-disable-next-line react/no-access-state-in-setstate
        const fields = this.state.feedback;
        fields[index] = '';
        this.setState({ feedback: fields });
      }
    });
  };

  render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { feedback } = this.state;
    return (
      <Segment>
        <Header as="h4" dividing content="PENDING VERIFICATION REQUESTS" />
        <Container fluid={false} style={{ paddingBottom: '14px' }}>
          {this.props.pendingVerifications.map((ele: IVerificationRequest, i) => (
            <Grid key={ele._id}>
              <Grid.Row style={{ paddingBottom: '0px', paddingLeft: '14px' }}>
                <Header as="h3">{this.buildHeaderString(ele)}</Header>
              </Grid.Row>
              <Grid.Row columns={2} style={{ paddingTop: '0px', paddingBottom: '0px' }}>
                <Grid.Column>
                Student:
                  {' '}
                  {this.studentProfile(ele).firstName}
                  {' '}
                  {this.cachedStudent.lastName}
                  <br />
                Sponsor:
                  {' '}
                  {this.sponsorProfile(ele).firstName}
                  {' '}
                  {this.cachedSponsor.lastName}
                  <br />
                  <Form style={{ paddingTop: '14px' }}>
                    <Form.Input
                      placeholder="Optional feedback"
                      index={i}
                      onChange={this.handleChange}
                      value={feedback[i] || ''}
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
                        onClick={this.handleForm}
                        student={this.cachedStudent}
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
                        onClick={this.handleForm}
                        student={this.cachedStudent}
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
          {this.props.pendingVerifications.length < 1 && <i>No pending requests.</i>}
        </Container>
      </Segment>
    );
  }
}

export default PendingVerificationsWidget;
