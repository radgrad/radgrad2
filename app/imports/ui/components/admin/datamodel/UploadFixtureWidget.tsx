import React, { useState } from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { loadFixtureMethod } from '../../../../api/base/BaseCollection.methods';
import { dataModelActions } from '../../../../redux/admin/data-model';
import UploadFixtureResultWidget from './UploadFixtureResultWidget';
import { RootState } from '../../../../redux/types';

/* global FileReader */

interface UploadFixtureWidgetProps {
  setUploadFixtureWorking: () => any;
  setUploadFixtureDone: () => any;
  uploadFixtureWorking: boolean;
}

const mapStateToProps = (state: RootState) => ({
  uploadFixtureWorking: state.admin.dataModel.uploadFixture.working,
});

const mapDispatchToProps = (dispatch) => ({
  setUploadFixtureWorking: () => dispatch(dataModelActions.setUploadFixtureWorking(true)),
  setUploadFixtureDone: () => dispatch(dataModelActions.setUploadFixtureWorking(false)),
});

const UploadFixtureWidget: React.FC<UploadFixtureWidgetProps> = ({ setUploadFixtureDone, setUploadFixtureWorking, uploadFixtureWorking }) => {
  const [fileDataState, setFileData] = useState('');
  const [uploadResult, setUploadResult] = useState('');
  const [error, setError] = useState(false);

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
    setUploadFixtureWorking();
    const jsonData = JSON.parse(fileDataState);
    loadFixtureMethod.call(jsonData, (err, result) => {
      if (err) {
        console.error('Error loading fixture', err);
        setError(true);
        setUploadResult(err.message);
      } else {
        setError(false);
        setUploadResult(result);
      }
      setUploadFixtureDone();
    });
  };
  return (
    <Segment padded>
      <Header as="h4" dividing>UPLOAD FIXTURE</Header>
      <Form widths="equal" onSubmit={onSubmit}>
        <Form.Field>
          <Form.Input type="file" onChange={readFile} label="FIXTURE" />
          <Form.Button basic color="green" loading={uploadFixtureWorking} type="Submit">UPLOAD FIXTURE</Form.Button>
        </Form.Field>
      </Form>
      {uploadResult ? <UploadFixtureResultWidget error={error} message={uploadResult} /> : ''}
    </Segment>
  );

};

export default connect(mapStateToProps, mapDispatchToProps)(UploadFixtureWidget);
