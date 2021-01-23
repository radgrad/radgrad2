import React, { useState } from 'react';
import { Segment, Header, Form } from 'semantic-ui-react';
import moment from 'moment';
import { processVerificationEventMethod } from '../../../../api/verification/VerificationRequestCollection.methods';
import { Opportunity } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';

interface EventVerificationsWidgetProps {
  eventOpportunities: Opportunity[];
}

/**
 * This component naively displays a supplied array of **IEventOpportunities** and a form to verify individual students.
 * The parent component is expected to handle permissions and filtering (eventDate property **is not checked** in this
 * component).
 * @param eventOpportunities {IEventOpportunity[]} An array of IOpportunities where eventDate exists
 * @returns {Segment}
 */
const EventVerificationsWidget: React.FC<EventVerificationsWidgetProps> = ({ eventOpportunities }) => {
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
    const opportunity = eventOpportunities.find((ele) => ele._id === opportunityState);

    onLog(`Verifying ${opportunity.name} for ${studentState}...`);

    const academicTerm = AcademicTerms.getAcademicTerm(opportunity.eventDate);

    processVerificationEventMethod.call(
      {
        student: studentState,
        opportunity: opportunityState,
        academicTerm,
      },
      (e, result) => {
        if (e) {
          onLog(`Error: problem during processing: ${e}\n`);
        } else {
          onLog(result);
        }
      },
    );
  };

  // componentDidUpdate(prevProps: Readonly<IEventVerificationsWidgetProps>, prevState: Readonly<{}>): void {
  //   if (prevState !== this.state) {
  //     this.scrollToBottom();
  //   }
  // }

  return (
    <Segment>
      <Header as="h4" dividing content="EVENT VERIFICATION" />
      <Form onSubmit={onSubmit}>
        <Form.Group inline>
          <Form.Dropdown
            options={eventOpportunities.map((ele, i) => ({
              key: i,
              text: `${ele.name} (${moment(ele.eventDate).format('MM/DD/YY')})`,
              value: ele._id,
            }))}
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

export default EventVerificationsWidget;
