import React, { useState } from 'react';
import { Button, Input, Segment, Tab } from 'semantic-ui-react';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import { findOddStudentsMethod } from '../../../../api/user/StudentProfileCollection.methods';
import { COMPONENTIDS } from '../../../utilities/ComponentIDs';
import RadGradAlert from '../../../utilities/RadGradAlert';
import { alumniEmailsMethod } from '../../../../api/base/BaseCollection.methods';
import { starBulkLoadJsonDataMethod } from '../../../../api/star/StarProcessor.methods';
import { generateStudentEmailsMethod } from '../../../../api/user/UserCollection.methods';
import { useStickyState } from '../../../utilities/StickyState';
import ProfileLabel from '../../shared/profile/ProfileLabel';
import RadGradTabHeader from '../../shared/RadGradTabHeader';
import { updateAllStudentLevelsMethod } from '../../../../api/level/LevelProcessor.methods';
import { Users } from '../../../../api/user/UserCollection';

const AdvisorOtherTab: React.FC = () => {
  const [bulkCourseDataState, setBulkCourseData] = useState('');
  const [alumniEmailsState, setAlumniEmails] = useState('');
  const [isAlumniWorkingState, setIsAlumniWorking] = useState(false);
  const [isEmailWorkingState, setIsEmailWorking] = useState(false);
  const [isUploadWorkingState, setIsUploadWorking] = useState(false);
  const [isUpdateWorkingState, setIsUpdateWorking] = useState(false);
  const [isUpdateOldWorkingState, setIsUpdateOldWorking] = useState(false);
  const [oddStudents, setOddStudents] = useStickyState('ManageStudents.oddStudents', []);

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
    if (files.length > 0) {
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
    }
  };

  const handleUpdateLevelButton = (event) => {
    event.preventDefault();
    setIsUpdateWorking(true);
    updateAllStudentLevelsMethod
      .callPromise({})
      .then((resultText) => {
        RadGradAlert.success('All levels updated successfully', resultText);
        setIsUpdateWorking(false);
      })
      .catch((error) => {
        RadGradAlert.failure('Error updating levels', 'A problem occurred during update', error);
        setIsUpdateWorking(false);
      });
  };

  const handleAlumniSubmit = () => {
    setIsAlumniWorking(true);
    const alumniEmails = alumniEmailsState;
    alumniEmailsMethod
      .callPromise(alumniEmails)
      .then(() => {
        RadGradAlert.success('Alumni emails loaded successfully');
        setAlumniEmails('');
        setIsAlumniWorking(false);
      })
      .catch((error) => {
        RadGradAlert.failure('Error loading alumni emails', error.message, error);
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
    starBulkLoadJsonDataMethod
      .callPromise(data)
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
    generateStudentEmailsMethod.callPromise({})
      .catch((error) => {
        RadGradAlert.failure('Error during Generating Student Emails', error.message, error);
        setIsEmailWorking(false);
      })
      .then((result) => {
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
        setIsEmailWorking(false);
      });
  };

  const handleFindOddStudents = () => {
    setIsUpdateOldWorking(true);
    findOddStudentsMethod
      .callPromise(null)
      .then((result) => {
        setOddStudents(result);
        setIsUpdateOldWorking(false);
      })
      .catch((error) => RadGradAlert.failure('Failed to get odd students.', error.message));
  };

  const bulkUploadRightSide = (
    <>
      <Input
        type="file"
        onChange={readFile}
        size="mini"
        label={{
          basic: true,
          color: 'green',
          content: 'Bulk Course Data JSON',
        }}
      />
      <Button size="tiny" basic color="green" onClick={handleStarSubmit} loading={isUploadWorkingState} disabled={isUploadWorkingState}>
        UPLOAD
      </Button>
    </>
  );

  const alumniEmailsUploadRightSide = (
    <>
      <Input
        type="file"
        onChange={readAlumniFile}
        size="mini"
        label={{
          basic: true,
          color: 'green',
          content: 'Alumni Emails file',
        }}
      />
      <Button size="tiny" basic color="green" onClick={handleAlumniSubmit} loading={isAlumniWorkingState} disabled={isAlumniWorkingState}>
        UPLOAD
      </Button>
    </>
  );

  return (
    <Tab.Pane key={COMPONENTIDS.OTHER_TAB_PANE} id={COMPONENTIDS.OTHER_TAB_PANE}>
      <Segment vertical>
        <RadGradTabHeader
          title="Update all students' levels"
          icon="sort amount up"
          rightside={
            <Button size="mini" basic color="green" onClick={handleUpdateLevelButton} loading={isUpdateWorkingState} disabled={isUpdateWorkingState}>
              UPDATE LEVELS
            </Button>
          }
        />
      </Segment>
      <Segment vertical>
        <RadGradTabHeader
          title="Get student emails"
          icon="envelope"
          rightside={
            <Button size="mini" basic color="green" onClick={getStudentEmails} loading={isEmailWorkingState} disabled={isEmailWorkingState}>
              DOWNLOAD
            </Button>
          }
        />
      </Segment>
      <Segment vertical>
        <RadGradTabHeader title="Bulk course data upload" icon="upload" rightside={bulkUploadRightSide} />
      </Segment>
      <Segment vertical>
        <RadGradTabHeader title="Bulk alumni data upload" icon="upload" rightside={alumniEmailsUploadRightSide} />
      </Segment>
      <Segment vertical>
        <RadGradTabHeader
          title="Find odd students"
          icon="highlighter"
          rightside={
            <Button
              basic
              color="green"
              onClick={() => {
                setIsUpdateOldWorking(true);
                handleFindOddStudents();
              }}
              size="mini"
              loading={isUpdateOldWorkingState}
              disabled={isUpdateOldWorkingState}
            >
              FIND ODD STUDENTS
            </Button>
          }
        />
        {oddStudents.length > 0 ? oddStudents.map((s) => <ProfileLabel key={s.userID} name={Users.getFullName(s.userID)} level={s.level} size="mini" />) : 'No odd students'}
      </Segment>
    </Tab.Pane>
  );
};
export default AdvisorOtherTab;
