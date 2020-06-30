import React, { useState } from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { loadFixtureMethod } from '../../../api/base/BaseCollection.methods';
import { dataModelActions } from '../../../redux/admin/data-model';
import UploadMessageWidget from './UploadMessageWidget';
import { RootState } from '../../../redux/types';

/* global FileReader */

interface IUploadFixtureWidgetProps {
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

const UploadFixtureWidget = (props: IUploadFixtureWidgetProps) => {
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
    });
  };
  return (
    <Segment padded>
      <Header as="h4" dividing>UPLOAD FIXTURE</Header>
      <Form widths="equal" onSubmit={onSubmit}>
        <Form.Field>
          <Form.Input type="file" onChange={readFile} label="FIXTURE" />
          <Form.Button basic color="green" loading={props.uploadFixtureWorking} type="Submit">UPLOAD FIXTURE</Form.Button>
        </Form.Field>
      </Form>
      {uploadResult ? <UploadMessageWidget error={error} message={uploadResult} /> : ''}
    </Segment>
  );

};

export default connect(mapStateToProps, mapDispatchToProps)(UploadFixtureWidget);
