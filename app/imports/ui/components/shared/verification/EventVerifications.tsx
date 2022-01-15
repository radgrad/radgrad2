import React, { useState } from 'react';
import { Segment, Form } from 'semantic-ui-react';
import moment from 'moment';
import { processVerificationEventMethod } from '../../../../api/verification/VerificationRequestCollection.methods';
import { Opportunity } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import RadGradHeader from '../RadGradHeader';

interface EventVerificationsProps {
  eventOpportunities: Opportunity[];
}

/**
 * This component naively displays a supplied array of **IEventOpportunities** and a form to verify individual students.
 * The parent component is expected to handle permissions and filtering (eventDate property **is not checked** in this
 * component).
 * @param eventOpportunities {IEventOpportunity[]} An array of IOpportunities where eventDate exists
 * @returns {Segment}
 */
const EventVerifications: React.FC<EventVerificationsProps> = ({ eventOpportunities }) => {
  const [studentState, setStudent] = useState('');
  const [opportunityState, setOpportunity] = useState('');
  const [logState, setLog] = useState('');

  const onChange = (e, { name, value }) => {
    switch (name) {
      case 'student':
        setStudent(value);
        break;
      case 'opportunity':
        setOpportunity(value);
        break;
      case 'log':
        setLog(value);
        break;
      default:
      // do nothing
    }
  };

  const onLog = (msg) => {
    setLog(`${logState}\n${msg}`);
  };

  // const scrollToBottom = () => {
  //   const textarea = document.getElementById('logTextArea');
  //   textarea.scrollTop = textarea.scrollHeight;
  // };

  const onSubmit = () => {
    // console.log('onSubmit', opportunityState, studentState);
    const opportunity = eventOpportunities.find((ele) => ele._id === opportunityState);

    // onLog(`Verifying ${opportunity.name} for ${studentState}...`);

    const academicTerm = AcademicTerms.getAcademicTerm(opportunity.eventDate1);

    processVerificationEventMethod.callPromise(
      {
        student: studentState,
        opportunity: opportunityState,
        academicTerm,
      })
      .catch(e => onLog(`Error: problem during processing: ${e}\n`))
      .then(result => onLog(result));
  };

  // componentDidUpdate(prevProps: Readonly<IEventVerificationsWidgetProps>, prevState: Readonly<{}>): void {
  //   if (prevState !== this.state) {
  //     this.scrollToBottom();
  //   }
  // }
  const eventOptions = [];
  eventOpportunities.forEach((event) => {
    eventOptions.push({ key: `${event._id}1`, text: `${event.name} (${moment(event.eventDate1).format('MM/DD/YY')})`, value: event._id });
    eventOptions.push({ key: `${event._id}2`, text: `${event.name} (${moment(event.eventDate2).format('MM/DD/YY')})`, value: event._id });
    eventOptions.push({ key: `${event._id}3`, text: `${event.name} (${moment(event.eventDate3).format('MM/DD/YY')})`, value: event._id });
    eventOptions.push({ key: `${event._id}4`, text: `${event.name} (${moment(event.eventDate4).format('MM/DD/YY')})`, value: event._id });
  });
  return (
    <Segment>
      <RadGradHeader title='event verification' dividing />
      <Form onSubmit={onSubmit}>
        <Form.Group inline>
          <Form.Dropdown
            options={eventOptions}
            label="Select recent event: "
            placeholder="Select One..."
            name="opportunity"
            onChange={onChange}
            value={opportunityState}
          />
          <Form.Input placeholder="Student Username" name="student" onChange={onChange} value={studentState} />
          <Form.Button basic color="green" content="Verify Attendance" />
        </Form.Group>
        <Form.TextArea id="logTextArea" label="Log" rows="10" value={logState} readOnly />
      </Form>
    </Segment>
  );
};

export default EventVerifications;
