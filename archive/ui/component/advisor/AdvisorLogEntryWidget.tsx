import React, { useState } from 'react';
import { Segment, Header, Form } from 'semantic-ui-react';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { Users } from '../../../../app/imports/api/user/UserCollection';
import { defineMethod } from '../../../../app/imports/api/base/BaseCollection.methods';
import { AdvisorLog, AdvisorLogDefine, StudentProfile } from '../../../../app/imports/typings/radgrad';
import RadGradAlerts from '../../../../app/imports/ui/utilities/RadGradAlert';

export interface AdvisorLogEntryWidgetProps {
  advisorLogs: AdvisorLog[];
  usernameDoc: StudentProfile;
  advisorUsername: string;
}

const RadGradAlert = new RadGradAlerts();
const AdvisorLogEntryWidget: React.FC<AdvisorLogEntryWidgetProps> = ({ advisorLogs, usernameDoc, advisorUsername }) => {
  const [commentState, setComment] = useState('');

  // For use with Date.getMinutes()
  const formatMinuteString = (min) => {
    if (min === 0) {
      return '00';
    }
    if (min > 0 && min < 10) {
      return `0${min}`;
    }
    if (min > 9 && min < 60) {
      return min.toString();
    }
    return 'formatMinuteString: error';
  };

  const handleForm = (e, { value }) => {
    setComment(value);
  };

  const onSubmit = () => {
    const collectionName = AdvisorLogs.getCollectionName();
    const definitionData: AdvisorLogDefine = {
      advisor: advisorUsername,
      student: usernameDoc.username,
      text: commentState,
    };

    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        RadGradAlert.failure('Add failed', error.message, 2500, error);
      } else {
        RadGradAlert.success('Add succeeded', 1500);
        setComment('');
      }
    });
  };

  return (
    <Segment padded>
      <Header as="h4" dividing>ADVISOR LOG</Header>
      <Form onSubmit={onSubmit} widths="equal">
        <Form.TextArea
          label="Comments"
          name="comment"
          onChange={handleForm}
          value={commentState}
        />
        <Form.Button content="ADD COMMENTS" type="Submit" basic color="green" />
      </Form>
      <br />
      <p style={{
        marginTop: '15px',
        display: 'block',
        margin: '0 0 .28571429rem 0',
        color: '#696969',
        fontSize: '.92857143em',
        fontWeight: 700,
        textTransform: 'none',
      }}
      >
        Past Advisor Logs
      </p>
      <div style={{ height: '200px' }}>
        <div style={{ height: '100%', overflowY: 'auto' }}>
          {advisorLogs.length > 0 ? advisorLogs.map(
            (ele) => (
              <Segment key={ele._id}>
                <strong>
                  {ele.createdOn.toDateString()} {ele.createdOn.getHours()}
                  :
                  {formatMinuteString(ele.createdOn.getMinutes())}
                  :
                </strong> {ele.text} <i>({Users.getProfile(ele.advisorID).firstName})
                </i>
              </Segment>
            ),
          ) : <i>No past advisor logs with this student.</i>}
        </div>
      </div>
    </Segment>
  );
};

export default AdvisorLogEntryWidget;
