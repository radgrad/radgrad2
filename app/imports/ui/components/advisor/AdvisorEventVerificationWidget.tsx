import * as React from 'react';
import { Segment, Header, Form } from 'semantic-ui-react';
import { moment } from 'meteor/momentjs:moment';
import { processVerificationEventMethod } from '../../../api/verification/VerificationRequestCollection.methods';
// eslint-disable-next-line no-unused-vars
import { IOpportunity } from '../../../typings/radgrad';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';

interface IAdvisorPendingVerificationWidgetProps {
  eventOpportunities: IOpportunity[];
}

class AdvisorEventVerificationWidget extends React.Component<IAdvisorPendingVerificationWidgetProps> {
  logRef = React.createRef();
  state = { student: '', opportunity: '', log: '' };

  onChange = (e, { name, value }) => this.setState({ ...this.state, [name]: value });

  onLog = (msg) => this.setState({ ...this.state, log: `${this.state.log}${msg}\n` })

  scrollToBottom = () => {
    if (this.logRef) {
      this.logRef.current.scrollTop = this.logRef.current.scrollHeight;
    }
  };

  onSubmit = () => {
    const { student, opportunity: opportunityID } = this.state;
    const opportunity = this.props.eventOpportunities.find(ele => ele._id === opportunityID);

    this.onLog(`Verifying ${opportunity.name} for ${student}...`);

    const academicTerm = AcademicTerms.getAcademicTerm(opportunity.eventDate);

    processVerificationEventMethod.call({ student, opportunity: opportunityID, academicTerm }, (e, result) => {
      if (e) {
        this.onLog(`Error: problem during processing: ${e}`);
      } else {
        this.onLog(result);
      }
      this.scrollToBottom();
    });
  }

  render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { student, opportunity, log } = this.state;
    return (
      <Segment>
        <Header as={'h4'} dividing content={'EVENT VERIFICATION'}/>
        <Form onSubmit={this.onSubmit}>
          <Form.Group inline>
            <Form.Dropdown
              options={this.props.eventOpportunities.map(
                (ele, i) => ({
                  key: i,
                  text: `${ele.name} (${moment(ele.eventDate).format('MM/DD/YY')})`,
                  value: ele._id,
                }),
              )}
              label={'Select recent event: '}
              placeholder={'Select One...'}
              name={'opportunity'}
              onChange={this.onChange}
              value={opportunity}/>
            <Form.Input placeholder={'Student Username'} name={'student'} onChange={this.onChange} value={student}/>
            <Form.Button basic color={'green'} content={'Verify Attendance'}/>
          </Form.Group>
          <Form.TextArea ref={this.logRef} label={'Log'} rows={'10'} value={log} readOnly={true}/>
        </Form>
      </Segment>
    );
  }
}

export default AdvisorEventVerificationWidget;
