import React, { useState } from 'react';
import { Segment, Header, Form } from 'semantic-ui-react';
import { starLoadDataMethod } from '../../../../api/star/StarProcessor.methods';
import { updateLevelMethod } from '../../../../api/level/LevelProcessor.methods';
import { StudentProfile } from '../../../../typings/radgrad';

/* global FileReader */

export interface AdvisorStarUploadWidgetProps {
  usernameDoc: StudentProfile;
  advisorUsername: string;
}

const AdvisorStarUploadWidget: React.FC<AdvisorStarUploadWidgetProps> = ({ usernameDoc, advisorUsername }) => {
  const [fileDataState, setFileData] = useState('');

  const readFile = (e) => {
    const files = e.target.files;
    const reader = new FileReader();
    reader.readAsText(files[0]);

    reader.onload = (event: { [k: string]: any }) => {
      setFileData(event.target.result);
    };
  };

  const onSubmit = () => {
    // console.log('Data submitted: ', fileDataState);
    // TODO -- find out more about how data is uploaded from STAR
    const advisor = advisorUsername;
    const studentDoc = usernameDoc;
    const csvData = fileDataState;
    starLoadDataMethod.call({ advisor, student: studentDoc.username, csvData }, (error) => {
      if (error) {
        console.log('Error loading STAR data', error);
      }
    });
    setFileData('');
    updateLevelMethod.call({ studentID: studentDoc.userID }, (e) => {
      if (e) {
        console.log('Error updating student level', e);
      }
    });
  };

  return (
    <Segment padded>
      <Header as="h4" dividing>UPLOAD STAR DATA</Header>
      <Form widths="equal" onSubmit={onSubmit}>
        <Form.Field>
          <Form.Input type="file" onChange={readFile} label="STAR CSV" />
          <Form.Button basic color="green" type="Submit">LOAD STAR DATA</Form.Button>
        </Form.Field>
      </Form>
    </Segment>
  );
};

export default AdvisorStarUploadWidget;
