import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import { Segment, Header, Grid, Form, Container, Button, Label } from 'semantic-ui-react';
import { moment } from 'meteor/momentjs:moment';
// eslint-disable-next-line no-unused-vars
import { IAcademicTerm, IOpportunity, IProcessed, IVerificationRequest } from '../../../typings/radgrad';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { Users } from '../../../api/user/UserCollection';
import { verificationRequestsUpdateStatusMethod } from '../../../api/verification/VerificationRequestCollection.methods';

interface IAdvisorCompletedVerificationWidgetProps {
  completedVerifications: IVerificationRequest[];
  username: string;
}

class AdvisorCompletedVerificationWidget extends React.Component<IAdvisorCompletedVerificationWidgetProps> {
  buildHeaderString = (verificationRequest: IVerificationRequest) => {
    const id = verificationRequest._id;
    const opp: IOpportunity = VerificationRequests.getOpportunityDoc(id);
    const term: IAcademicTerm = VerificationRequests.getAcademicTermDoc(id);
    return `${opp.name}, ${term.term} ${term.year}`;
  }

  getStudentFullName = (verificationRequest: IVerificationRequest) => {
    const id = verificationRequest._id;
    const profile = VerificationRequests.getStudentDoc(id);
    return Users.getFullName(profile);
  }

  getSponsorFullName = (verificationRequest: IVerificationRequest) => {
    const id = verificationRequest._id;
    const profile = VerificationRequests.getSponsorDoc(id);
    return Users.getFullName(profile);
  }

  getStatusColor = (status) => (status === VerificationRequests.REJECTED ? 'red' : 'green');

  onClick = (e, { doc }) => {
    const id = doc._id;
    const status = VerificationRequests.OPEN;
    const processRecord: IProcessed = {
      date: new Date(),
      status: VerificationRequests.OPEN,
      verifier: Users.getFullName(this.props.username),
    };
    const processed = doc.processed;
    processed.push(processRecord);
    verificationRequestsUpdateStatusMethod.call({ id, status, processed });
  }

  render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <Segment>
        <Header as={'h4'} dividing content={'COMPLETED VERIFICATION REQUESTS'}/>
        <Container fluid={false} style={{ paddingBottom: '14px' }}>
          {this.props.completedVerifications.map((ele: IVerificationRequest, i) => <Grid key={i}>
            <Grid.Row style={{ paddingBottom: '0px', paddingLeft: '14px' }}>
              <Header as={'h3'}>{this.buildHeaderString(ele)}</Header>
            </Grid.Row>
            <Grid.Row columns={2} style={{ paddingTop: '0px', paddingBottom: '0px' }}>
              <Grid.Column>
                Student: {this.getStudentFullName(ele)}<br/>
                Sponsor: {this.getSponsorFullName(ele)}<br/>
                <Grid.Row style={{ paddingTop: '14px', paddingBottom: '14px' }}>
                  <Button basic compact color={this.getStatusColor(ele.status)} content={'REOPEN'} attached={'right'}
                          label={{
                            size: 'mini',
                            basic: false,
                            color: this.getStatusColor(ele.status),
                            pointing: 'right',
                            content: ele.status,
                          }}
                          labelPosition={'left'} icon={'edit outline'}
                          index={i}
                          command={VerificationRequests.OPEN}
                          onClick={this.onClick}
                          doc={ele}/>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column>
                {`Submitted: ${moment(ele.submittedOn).calendar()}`}<br/>
                {ele.processed.map((elem: IProcessed, ind) => <React.Fragment key={ind}>
                  Processed: {moment(elem.date).calendar()} by {elem.verifier} ({elem.status}{elem.feedback ? `, ${elem.feedback}` : ''})
                  <br/>
                </React.Fragment>)}
              </Grid.Column>
            </Grid.Row>
          </Grid>)}
        </Container>
      </Segment>
    );
  }
}

export default AdvisorCompletedVerificationWidget;
