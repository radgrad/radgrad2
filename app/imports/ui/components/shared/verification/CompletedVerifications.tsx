import React from 'react';
import { Segment, Header, Grid, Container, Button } from 'semantic-ui-react';
import moment from 'moment';
import { AcademicTerm, Opportunity, Processed, VerificationRequest } from '../../../../typings/radgrad';
import { VerificationRequests } from '../../../../api/verification/VerificationRequestCollection';
import { Users } from '../../../../api/user/UserCollection';
import { verificationRequestsUpdateStatusMethod } from '../../../../api/verification/VerificationRequestCollection.methods';
import RadGradHeader from '../RadGradHeader';

interface CompletedVerificationsProps {
  completedVerifications: VerificationRequest[];
  username: string;
}

const getStudentFullName = (verificationRequest: VerificationRequest) => {
  const id = verificationRequest._id;
  const profile = VerificationRequests.getStudentDoc(id);
  return Users.getFullName(profile);
};

const buildHeaderString = (verificationRequest: VerificationRequest) => {
  const id = verificationRequest._id;
  const opp: Opportunity = VerificationRequests.getOpportunityDoc(id);
  const term: AcademicTerm = VerificationRequests.getAcademicTermDoc(id);
  return `${opp.name}, ${term.term} ${term.year}`;
};

const getSponsorFullName = (verificationRequest: VerificationRequest) => {
  const id = verificationRequest._id;
  const profile = VerificationRequests.getSponsorDoc(id);
  return Users.getFullName(profile);
};

const getStatusColor = (status) => (status === VerificationRequests.REJECTED ? 'red' : 'green');

const handleOnClick = (username: string) => (e, { doc }) => {
  const id = doc._id;
  const status = VerificationRequests.OPEN;
  const processRecord: Processed = {
    date: new Date(),
    status: VerificationRequests.OPEN,
    verifier: Users.getFullName(username),
  };
  const processed = doc.processed;
  processed.push(processRecord);
  verificationRequestsUpdateStatusMethod.call({ id, status, processed });
};

/**
 * Component that naively displays a supplied array of **IVerificationRequests** and the UI for users to handle them.
 * The parent component is expected to handle permissions and filtering (role and status **are not checked** in this
 * component).
 * @param completedVerifications {VerificationRequest[]}
 * @param username {string} Current user's username. Used primarily for getting name of user when making changes to
 * records.
 * @returns {Segment}
 */
const CompletedVerifications: React.FC<CompletedVerificationsProps> = ({ completedVerifications, username }) => (
  <Segment>
    <RadGradHeader title='completed verification requests' dividing />
    <Container fluid={false} style={{ paddingBottom: '14px' }}>
      {completedVerifications.map((ele: VerificationRequest, i) => (
        <Grid key={ele._id}>
          <Grid.Row style={{ paddingBottom: '0px', paddingLeft: '14px' }}>
            <Header as="h3">{buildHeaderString(ele)}</Header>
          </Grid.Row>
          <Grid.Row columns={2} style={{ paddingTop: '0px', paddingBottom: '0px' }}>
            <Grid.Column>
              Student: {getStudentFullName(ele)}
              <br />
              Sponsor: {getSponsorFullName(ele)}
              <br />
              Justification: {ele.documentation}
              <Grid.Row style={{ paddingTop: '14px', paddingBottom: '14px' }}>
                <Button
                  basic
                  compact
                  color={getStatusColor(ele.status)}
                  content="REOPEN"
                  attached="right"
                  label={{
                    size: 'mini',
                    basic: false,
                    color: getStatusColor(ele.status),
                    pointing: 'right',
                    content: ele.status,
                  }}
                  labelPosition="left"
                  icon="edit outline"
                  index={i}
                  command={VerificationRequests.OPEN}
                  onClick={handleOnClick(username)}
                  doc={ele}
                />
              </Grid.Row>
            </Grid.Column>
            <Grid.Column>
              {`Submitted: ${moment(ele.submittedOn).calendar()}`}
              <br />
              {ele.processed.map((elem: Processed) => (
                <React.Fragment key={`${elem.verifier}${elem.date}`}>
                  Processed: {moment(elem.date).calendar()} by {elem.verifier} ({elem.status}
                  {elem.feedback ? `, ${elem.feedback}` : ''})
                  <br />
                </React.Fragment>
              ))}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      ))}
      {completedVerifications.length < 1 && <i>No completed verifications in database.</i>}
    </Container>
  </Segment>
);

export default CompletedVerifications;
