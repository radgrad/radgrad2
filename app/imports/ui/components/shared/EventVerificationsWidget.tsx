import React from 'react';
import { Segment, Header, Form } from 'semantic-ui-react';
import moment from 'moment';
import { processVerificationEventMethod } from '../../../api/verification/VerificationRequestCollection.methods';
// eslint-disable-next-line no-unused-vars
import { IOpportunity } from '../../../typings/radgrad';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';

/* global document */

interface IEventVerificationsWidgetProps {
  eventOpportunities: IOpportunity[];
}

interface IEventVerificationsWidgetState {
  student: string;
  opportunity: string;
  log: string;
}
/**
 * This component naively displays a supplied array of **IEventOpportunities** and a form to verify individual students.
 * The parent component is expected to handle permissions and filtering (eventDate property **is not checked** in this
 * component).
 * @param eventOpportunities {IEventOpportunity[]} An array of IOpportunities where eventDate exists
 * @returns {Segment}
 */
class EventVerificationsWidget extends React.Component<IEventVerificationsWidgetProps, IEventVerificationsWidgetState> {
  constructor(props) {
    super(props);
    this.state = { student: '', opportunity: '', log: '' };
  }

  onChange = (e, { name, value }) => this.setState({ ...this.state, [name]: value });

  onLog = (msg) => {
    this.setState({ ...this.state, log: `${this.state.log}\n${msg}` });
  }

  scrollToBottom = () => {
    const textarea = document.getElementById('logTextArea');
    textarea.scrollTop = textarea.scrollHeight;
  };

  onSubmit = () => {
    const { student, opportunity: opportunityID } = this.state;
    const opportunity = this.props.eventOpportunities.find(ele => ele._id === opportunityID);

    this.onLog(`Verifying ${opportunity.name} for ${student}...`);

    const academicTerm = AcademicTerms.getAcademicTerm(opportunity.eventDate);

    processVerificationEventMethod.call({ student, opportunity: opportunityID, academicTerm }, (e, result) => {
      if (e) {
        this.onLog(`Error: problem during processing: ${e}\n`);
      } else {
        this.onLog(result);
      }
    });
  }


  componentDidUpdate(prevProps: Readonly<IEventVerificationsWidgetProps>, prevState: Readonly<{}>): void {
    if (prevState !== this.state) {
      this.scrollToBottom();
    }
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
          <Form.TextArea id={'logTextArea'} label={'Log'} rows={'10'} value={log} readOnly={true}/>
        </Form>
      </Segment>
    );
  }
}

export default EventVerificationsWidget;
