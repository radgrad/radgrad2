import React, { useState } from 'react';
import { Button, Input } from 'semantic-ui-react';
import RadGradSegment from '../../shared/RadGradSegment';
import RadGradHeader from '../../shared/RadGradHeader';
import RadGradAlert from '../../../utilities/RadGradAlert';
import { studentLoadStarDataMethod } from '../../../../api/star/StarProcessor.methods';

const UploadStarData: React.FC = () => {
  const [starCsvData, setStarCsvData] = useState('');
  const [isUploadWorkingState, setIsUploadWorking] = useState(false);

  const readFile = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const reader: FileReader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = (event: { [key: string]: any }) => {
        try {
          setStarCsvData(event.target.result);
        } catch (error) {
          RadGradAlert.failure('Error reading data from file', 'Please ensure the file you selected is formatted properly', error);
        }
      };
    }
  };

  const handleStarSubmit = () => {
    setIsUploadWorking(true);
    const data = {
      student: Meteor.user().username,
      csvData: starCsvData,
    };
    // console.log(data);
    studentLoadStarDataMethod.callPromise(data)
      .then((result) => {
        RadGradAlert.success('STAR Course Data loaded successfully', result);
        setIsUploadWorking(false);
      })
      .catch((error) => {
        RadGradAlert.failure('Error loading bulk course data', error.message, error);
        setStarCsvData('');
        setIsUploadWorking(false);
      });
  };

  const header = <RadGradHeader title="Upload STAR data" dividing />;
  const segment = (<RadGradSegment header={header}>
    <>
      <Input
        type="file"
        onChange={readFile}
        size="mini"
      />
      <Button size="tiny" basic color="green" onClick={handleStarSubmit} loading={isUploadWorkingState} disabled={isUploadWorkingState}>
        UPLOAD STAR DATA
      </Button>
    </>
  </RadGradSegment>);

  return segment;
};

export default UploadStarData;
