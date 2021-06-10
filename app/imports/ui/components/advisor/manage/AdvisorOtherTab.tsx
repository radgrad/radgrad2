import React, { useState } from 'react';
import { Button, Input, Segment, Tab } from 'semantic-ui-react';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import { COMPONENTIDS } from '../../../utilities/ComponentIDs';
import RadGradAlert from '../../../utilities/RadGradAlert';
import { alumniEmailsMethod } from '../../../../api/base/BaseCollection.methods';
import { starBulkLoadJsonDataMethod } from '../../../../api/star/StarProcessor.methods';
import { retireAllOldStudentsMethod, updateAllStudentsToAlumniMethod } from '../../../../api/user/StudentProfileCollection.methods';
import { generateStudentEmailsMethod } from '../../../../api/user/UserCollection.methods';
import RadGradTabHeader from '../../shared/RadGradTabHeader';
import { updateAllStudentLevelsMethod } from '../../../../api/level/LevelProcessor.methods';

const AdvisorOtherTab: React.FC = () => {
  const [bulkCourseDataState, setBulkCourseData] = useState('');
  const [alumniEmailsState, setAlumniEmails] = useState('');
  const [isAlumniWorkingState, setIsAlumniWorking] = useState(false);
  const [isEmailWorkingState, setIsEmailWorking] = useState(false);
  const [isUploadWorkingState, setIsUploadWorking] = useState(false);
  const [isUpdateWorkingState, setIsUpdateWorking] = useState(false);
  const [isUpdateOldWorkingState, setIsUpdateOldWorking] = useState(false);

  const readAlumniFile = (e) => {
    const files = e.target.files;
    const reader: FileReader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = (event: { [key: string]: any }) => {
      setAlumniEmails(event.target.result);
    };
  };

  const readFile = (e) => {
    const files = e.target.files;
    const reader: FileReader = new FileReader();
    reader.readAsText(files[0]);

    reader.onload = (event: { [key: string]: any }) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        setBulkCourseData(jsonData);
      } catch (error) {
        RadGradAlert.failure('Error reading data from file', 'Please ensure the file you selected is formatted properly', error);
      }
    };
  };

  const handleUpdateLevelButton = (event) => {
    event.preventDefault();
    setIsUpdateWorking(true);
    updateAllStudentLevelsMethod.call((error, result) => {
      if (error) {
        RadGradAlert.failure('Error updating students\' levels', 'There was an error updating the students\' levels', error);
      } else {
        RadGradAlert.success('Updates Students\' levels');
      }
    });
    setIsUpdateWorking(false);
  };

  const handleAlumniSubmit = () => {
    setIsAlumniWorking(true);
    const alumniEmails = alumniEmailsState;
    alumniEmailsMethod.call(alumniEmails, (error, result) => {
      if (error) {
        RadGradAlert.failure('Error loading alumni emails', error.message, error);
      } else {
        RadGradAlert.success('Alumni emails loaded successfully');
        setAlumniEmails('');
      }
      setIsAlumniWorking(false);
    });
  };

  const handleStarSubmit = () => {
    setIsUploadWorking(true);
    const jsonData = bulkCourseDataState;
    const data = {
      advisor: Meteor.user().username,
      jsonData,
    };
    // console.log(data);
    starBulkLoadJsonDataMethod.callPromise(data)
      .then((result) => {
        RadGradAlert.success('Bulk Course Data loaded successfully', result);
        setIsUploadWorking(false);
      })
      .catch((error) => {
        RadGradAlert.failure('Error loading bulk course data', error.message, error);
        setBulkCourseData('');
        setIsUploadWorking(false);
      });
  };

  const getStudentEmails = () => {
    setIsEmailWorking(true);
    generateStudentEmailsMethod.call({}, (error, result) => {
      if (error) {
        RadGradAlert.failure('Error during Generating Student Emails', error.message, error);
      } else {
        RadGradAlert.success('Beginning Download...');
        const data: any = {};
        data.name = 'Students';
        data.contents = result.students;
        const emails = result.students.join('\n');
        const zip = new ZipZap();
        const now = moment().format('YYYY-MM-DD-HH-mm-ss');
        const dir = `radgrad-students${now}`;
        const fileName = `${dir}/Students.txt`;
        zip.file(fileName, emails);
        zip.saveAs(`${dir}.zip`);
      }
    });
    setIsEmailWorking(false);
  };

  const handleUpdateStudentStatus = () => {
    setIsUpdateOldWorking(true);
    updateAllStudentsToAlumniMethod.callPromise({})
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    retireAllOldStudentsMethod.callPromise({})
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    setIsUpdateOldWorking(false);
  };

  const bulkUploadRightSide = <><Input type='file' onChange={readFile} size='mini' label={{
    basic: true,
    color: 'green',
    content: 'Bulk Course Data JSON',
  }} />
  <Button size='tiny' basic color='green'
    onClick={handleStarSubmit}
    loading={isUploadWorkingState}
    disabled={isUploadWorkingState}
  >UPLOAD</Button>
  </>;

  const alumniEmailsUploadRightSide = <>
    <Input type='file' onChange={readAlumniFile} size='mini' label={{
      basic: true,
      color: 'green',
      content: 'Alumni Emails file',
    }} />
    <Button size='tiny' basic color='green'
      onClick={handleAlumniSubmit}
      loading={isAlumniWorkingState}
      disabled={isAlumniWorkingState}
    >UPLOAD</Button>
  </>;

  return (
    <Tab.Pane key={COMPONENTIDS.OTHER_TAB_PANE} id={COMPONENTIDS.OTHER_TAB_PANE}>
      <Segment vertical><RadGradTabHeader title='Update all students&apos; levels' icon='sort amount up'
        rightside={<Button size='mini' basic color='green'
          onClick={handleUpdateLevelButton}
          loading={isUpdateWorkingState}
          disabled={isUpdateWorkingState}>UPDATE LEVELS</Button>} /></Segment>
      <Segment vertical><RadGradTabHeader title='Get student emails' icon='envelope'
        rightside={<Button size='mini' basic color='green' onClick={getStudentEmails}
          loading={isEmailWorkingState}
          disabled={isEmailWorkingState}>DOWNLOAD</Button>} /></Segment>
      <Segment vertical><RadGradTabHeader title='Bulk course data upload' icon='upload'
        rightside={bulkUploadRightSide} /></Segment>
      <Segment vertical><RadGradTabHeader title='Bulk alumni data upload' icon='upload'
        rightside={alumniEmailsUploadRightSide} /></Segment>
      <Segment vertical><RadGradTabHeader title='Update old student status' icon='highlighter'
        rightside={<Button basic color='green' onClick={handleUpdateStudentStatus} size='mini'
          loading={isUpdateOldWorkingState}
          disabled={isUpdateOldWorkingState}>UPDATE
                                            STATUS</Button>} /></Segment>
    </Tab.Pane>
  );
};

export default AdvisorOtherTab;
