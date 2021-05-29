import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Segment, Grid, Header, Tab, Form, Button, Image, Popup } from 'semantic-ui-react';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import { CareerGoal, Interest, StudentProfile } from '../../../../app/imports/typings/radgrad';
import AdvisorAddStudentTab from '../../../../app/imports/ui/components/advisor/manage/AdvisorAddStudentTab';
import { generateStudentEmailsMethod } from '../../../../app/imports/api/user/UserCollection.methods';
import { starBulkLoadJsonDataMethod } from '../../../../app/imports/api/star/StarProcessor.methods';
import { homeActions } from '../../../redux/advisor/home';
import { RootState } from '../../../redux/types';
import RadGradAlerts from '../../../../app/imports/ui/utilities/RadGradAlert';

/* global FileReader */

interface AdvisorStudentSelectorWidgetProps {
  dispatch: (any) => void;
  firstName: string;
  lastName: string;
  username: string;
  students: StudentProfile[];
  alumni: StudentProfile[];
  advisorUsername: string;
  interests: Interest[];
  careerGoals: CareerGoal[];
}

const RadGradAlert = new RadGradAlerts();

const mapStateToProps = (state: RootState) => ({
  firstName: state.advisor.home.firstName,
  lastName: state.advisor.home.lastName,
  username: state.advisor.home.username,
});

const AdvisorStudentSelectorWidget: React.FC<AdvisorStudentSelectorWidgetProps> = ({ dispatch, advisorUsername, careerGoals, interests, students, username, alumni, firstName, lastName }) => {
  const [fileDataState, setFileData] = useState('');
  const [isEmailWorkingState, setIsEmailWorking] = useState(false);
  const [isUploadWorkingState, setIsUploadWorking] = useState(false);
  const [generatedDataState, setGeneratedData] = useState('');

  const handleTabChange = () => {
    dispatch(homeActions.setSelectedStudentUsername(''));
    setFileData('');
    setGeneratedData('');
  };

  // Functionality for 'Update Existing' tab
  const handleChangeFirstName = (event) => {
    dispatch(homeActions.setFirstName(event.target.value));
  };

  const handleChangeLastName = (event) => {
    dispatch(homeActions.setLastName(event.target.value));
  };

  const handleChangeUserName = (event) => {
    dispatch(homeActions.setUsername(event.target.value));
  };

  const clearFilter = () => {
    dispatch(homeActions.clearFilter());
  };

  const handleSelectStudent = (event, data) => {
    dispatch(homeActions.setSelectedStudentUsername(data.studentusername));
  };

  // Functionality for 'Bulk STAR Upload' tab

  const readFile = (e) => {
    const files = e.target.files;
    const reader: FileReader = new FileReader();
    reader.readAsText(files[0]);

    reader.onload = (event: { [key: string]: any }) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        setFileData(jsonData);
      } catch (error) {
        RadGradAlert.failure('Error reading data from file', 'Please ensure the file you selected is formatted properly', 2500, error);
      }
    };
  };

  const handleStarSubmit = () => {
    setIsUploadWorking(true);
    const advisor = advisorUsername;
    const jsonData = fileDataState;
    starBulkLoadJsonDataMethod.call({ advisor, jsonData }, (error) => {
      if (error) {
        RadGradAlert.failure('Error loading bulk STAR data', error.message, 2500, error);
      } else {
        RadGradAlert.success('STAR Data loaded successfully', '', 1500);
        setFileData('');
      }
    });
    setIsUploadWorking(false);
  };

  const getStudentEmails = () => {
    setIsEmailWorking(true);
    generateStudentEmailsMethod.call({}, (error, result) => {
      if (error) {
        RadGradAlert.failure('Error during Generating Student Emails', error.message, 2500, error);
      } else {
        RadGradAlert.success('Beginning Download...', '', 1500);
        const data: any = {};
        data.name = 'Students';
        data.contents = result.students;
        const emails = result.students.join('\n');
        setGeneratedData(emails);
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

  const columnStyle = {
    padding: 2,
  };

  const buttonStyle = {
    overflow: 'hidden',
  };

  const filterFirst = students.filter((s) => s.firstName.toLowerCase().includes(firstName.toLowerCase()));
  const filterLast = filterFirst.filter((s) => s.lastName.toLowerCase().includes(lastName.toLowerCase()));
  const filteredStudents = filterLast.filter((s) => s.username.toLowerCase().includes(username.toLowerCase()));

  const filterAlumiFirst = alumni.filter((s) => s.firstName.toLowerCase().includes(firstName.toLowerCase()));
  const filterAlumniLast = filterAlumiFirst.filter((s) => s.lastName.toLowerCase().includes(lastName.toLowerCase()));
  const filteredAlumni = filterAlumniLast.filter((s) => s.username.toLowerCase().includes(username.toLowerCase()));

  const levelOnes = filteredStudents.filter((s) => s.level === 1).length;
  const levelTwos = filteredStudents.filter((s) => s.level === 2).length;
  const levelThrees = filteredStudents.filter((s) => s.level === 3).length;
  const levelFours = filteredStudents.filter((s) => s.level === 4).length;
  const levelFives = filteredStudents.filter((s) => s.level === 5).length;
  const levelSixes = filteredStudents.filter((s) => s.level === 6).length;
  const panes = [
    {
      menuItem: 'Update Existing',
      render: () => (
        <Tab.Pane key="update">
          <Header as="h4" dividing>
            FILTER STUDENTS
          </Header>
          <Form onSubmit={clearFilter}>
            <Form.Group inline>
              <Form.Field>
                <Form.Input name="firstName" label={{ basic: 'true', children: 'First Name:' }} value={firstName} onChange={handleChangeFirstName} />
              </Form.Field>
              <Form.Field>
                <Form.Input name="lastName" label={{ basic: 'true', children: 'Last Name:' }} value={lastName} onChange={handleChangeLastName} />
              </Form.Field>
              <Form.Field>
                <Form.Input name="userName" label={{ basic: 'true', children: 'Username:' }} value={username} onChange={handleChangeUserName} />
              </Form.Field>
              <Form.Button basic color="green" content="Clear Filter" />
            </Form.Group>
          </Form>
          <Header as="h4">
            <Image avatar src="/images/level-icons/radgrad-level-1-icon.png" /> {levelOnes} &nbsp;
            <Image avatar src="/images/level-icons/radgrad-level-2-icon.png" /> {levelTwos} &nbsp;
            <Image avatar src="/images/level-icons/radgrad-level-3-icon.png" /> {levelThrees} &nbsp;
            <Image avatar src="/images/level-icons/radgrad-level-4-icon.png" /> {levelFours} &nbsp;
            <Image avatar src="/images/level-icons/radgrad-level-5-icon.png" /> {levelFives} &nbsp;
            <Image avatar src="/images/level-icons/radgrad-level-6-icon.png" /> {levelSixes} &nbsp;
          </Header>
          <Tab
            panes={[
              {
                menuItem: `Students (${filteredStudents.length})`,
                render: () => (
                  <Tab.Pane>
                    <Grid stackable>
                      {filteredStudents.map((student) => (
                        <Grid.Column style={columnStyle} width={3} key={student._id}>
                          <Popup
                            content={`${student.lastName}, ${student.firstName}`}
                            position="top center"
                            trigger={
                              <Button basic color="grey" fluid style={buttonStyle} studentusername={student.username} onClick={handleSelectStudent}>
                                <Image avatar src={`/images/level-icons/radgrad-level-${student.level}-icon.png`} />
                                {student.lastName},{student.firstName}
                                <br />
                                {student.username}
                              </Button>
                            }
                          />
                        </Grid.Column>
                      ))}
                    </Grid>
                  </Tab.Pane>
                ),
              },
              {
                menuItem: `Alumni (${filteredAlumni.length})`,
                render: () => (
                  <Tab.Pane>
                    <Grid stackable>
                      {filteredAlumni.map((student) => (
                        <Grid.Column style={columnStyle} width={3} key={student._id}>
                          <Popup
                            content={`${student.lastName}, ${student.firstName}`}
                            position="top center"
                            trigger={
                              <Button basic color="grey" fluid style={buttonStyle} studentusername={student.username} onClick={handleSelectStudent}>
                                <Image avatar src={`/images/level-icons/radgrad-level-${student.level}-icon.png`} />
                                {student.lastName},{student.firstName}
                                <br />
                                {student.username}
                              </Button>
                            }
                          />
                        </Grid.Column>
                      ))}
                    </Grid>
                  </Tab.Pane>
                ),
              },
            ]}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Add New',
      render: () => <AdvisorAddStudentTab interests={interests} careerGoals={careerGoals} />,
    },
    {
      menuItem: 'Bulk STAR Upload',
      render: () => (
        <Tab.Pane key="upload">
          <Header dividing content="BULK STAR UPLOAD STAR DATA" />
          <Form onSubmit={handleStarSubmit}>
            <Form.Field>
              <Form.Input type="file" onChange={readFile} label="BULK STAR JSON" />
            </Form.Field>
            <Form.Group inline>
              <Form.Button size="tiny" basic color="green" content="LOAD BULK STAR DATA" type="Submit" loading={isUploadWorkingState} disabled={isUploadWorkingState || fileDataState === ''} />
              <Form.Button size="tiny" basic color="green" content="GET STUDENT EMAILS" onClick={getStudentEmails} loading={isEmailWorkingState} disabled={isEmailWorkingState} />
            </Form.Group>
          </Form>
          {generatedDataState ? <Segment>{generatedDataState}</Segment> : undefined}
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Segment>
      <Header as="h4" dividing>
        SELECT STUDENT
      </Header>
      <Tab panes={panes} onTabChange={handleTabChange} />
    </Segment>
  );
};

export default connect(mapStateToProps)(AdvisorStudentSelectorWidget);
