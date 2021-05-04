import React, { useState } from 'react';
import { Form } from 'semantic-ui-react';
import { loadFixtureMethod } from '../../../../api/base/BaseCollection.methods';
import { useStickyState } from '../../../utilities/StickyState';
import RadGradHeader from '../../shared/RadGradHeader';
import RadGradSegment from '../../shared/RadGradSegment';
import UploadFixtureResult from './UploadFixtureResult';

const header = <RadGradHeader title='Upload DB Fixture' icon='cloud upload alternate' />;

const UploadFixture: React.FC = () => {
  const [fileDataState, setFileData] = useState('');
  const [uploadResult, setUploadResult] = useState('');
  const [error, setError] = useState(false);
  const [uploadFixtureWorking, setUploadFixtureWorking] = useStickyState('UploadFixture', false);

  const readFile = (e) => {
    const files = e.target.files;
    const reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = (event: { [k: string]: any }) => {
      setFileData(event.target.result);
    };
  };

  const onSubmit = () => {
    const jsonData = fileDataState ? JSON.parse(fileDataState) : false;
    if (jsonData) {
      setUploadFixtureWorking(true);
      loadFixtureMethod.callPromise(jsonData)
        .then(result => { setUploadResult(result); })
        .catch(err => { setError(true); setUploadResult(err.message); })
        .finally(() => { console.log('finally'); setUploadFixtureWorking(false); });
    } else {
      setError(true);
      setUploadResult('No file specified');
    }
  };
  return (
    <RadGradSegment header={header}>
      <Form widths="equal" onSubmit={onSubmit}>
        <Form.Field>
          <Form.Input type="file" onChange={readFile} label="Fixture File" />
          <Form.Button basic color="green" loading={uploadFixtureWorking} type="Submit">
            Upload Fixture
          </Form.Button>
        </Form.Field>
      </Form>
      {uploadResult ? <UploadFixtureResult error={error} message={uploadResult} /> : ''}
    </RadGradSegment>
  );
};

export default UploadFixture;
