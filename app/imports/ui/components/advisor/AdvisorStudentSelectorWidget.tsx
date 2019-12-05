import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Segment, Grid, Header, Tab, Form, Button, Image, Popup } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { ZipZap } from 'meteor/udondan:zipzap';
import { moment } from 'meteor/momentjs:moment';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
// eslint-disable-next-line no-unused-vars
import { ICareerGoal, IInterest, IStudentProfile } from '../../../typings/radgrad';
import AdvisorAddStudentWidget from './AdvisorAddStudentWidget';
import { generateStudentEmailsMethod } from '../../../api/user/UserCollection.methods';
import { starBulkLoadJsonDataMethod } from '../../../api/star/StarProcessor.methods';
import { homeActions } from '../../../redux/advisor/home';

/* global FileReader */

interface IAdvisorStudentSelectorWidgetProps {
  dispatch: (any) => void;
  firstName: string;
  lastName: string;
  username: string;
  students: IStudentProfile[];
  advisorUsername: string;
  // These are parameters for reactivity
  interests: IInterest[];
  careerGoals: ICareerGoal[];
}

interface IAdvisorStudentSelectorWidgetState {
  fileData: string;
  isEmailWorking: boolean;
  isUploadWorking: boolean;
  generatedData: string;
}

const mapStateToProps = (state) => ({
  firstName: state.advisor.home.firstName,
  lastName: state.advisor.home.lastName,
  username: state.advisor.home.username,
});

class AdvisorStudentSelectorWidget extends React.Component<IAdvisorStudentSelectorWidgetProps, IAdvisorStudentSelectorWidgetState> {
  constructor(props) {
    super(props);
    this.state = { fileData: '', isEmailWorking: false, isUploadWorking: false, generatedData: '' };
  }

  private handleTabChange = () => {
    this.props.dispatch(homeActions.setSelectedStudentUsername(''));
    this.setState({ fileData: '', generatedData: '' });
  }

  // Functionality for 'Update Existing' tab
  public handleChangeFirstName = (event) => {
    this.props.dispatch(homeActions.setFirstName(event.target.value));
  };

  public handleChangeLastName = (event) => {
    this.props.dispatch(homeActions.setLastName(event.target.value));
  };

  public handleChangeUserName = (event) => {
    this.props.dispatch(homeActions.setUsername(event.target.value));
  };

  public clearFilter = () => {
    this.props.dispatch(homeActions.clearFilter());
  };

  public handleSelectStudent = (event, data) => {
    this.props.dispatch(homeActions.setSelectedStudentUsername(data.studentusername));
  };

  // Functionality for 'Bulk STAR Upload' tab

  private readFile = (e) => {
    const files = e.target.files;
    const reader: FileReader = new FileReader();
    reader.readAsText(files[0]);

    reader.onload = (event: {[key: string]: any}) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        this.setState({ fileData: jsonData });
      } catch (error) {
        Swal.fire({
          title: 'Error reading data from file',
          text: 'Please ensure the file you selected is formatted properly',
          icon: 'error',
        });
        console.error(error.message);
      }
    };
  };

  private handleStarSubmit = () => {
    this.setState({ isUploadWorking: true });
    const advisor = this.props.advisorUsername;
    const jsonData = this.state.fileData;
    starBulkLoadJsonDataMethod.call({ advisor, jsonData }, ((error) => {
      if (error) {
        Swal.fire({
          title: 'Error loading bulk STAR data',
          text: error.message,
          icon: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'STAR Data loaded successfully',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        this.setState({ fileData: '' });
      }
    }));
    this.setState({ isUploadWorking: false });
  };

  private getStudentEmails = () => {
    this.setState({ isEmailWorking: true });
    generateStudentEmailsMethod.call({}, (error, result) => {
      if (error) {
        Swal.fire({
          title: 'Error during Generating Student Emails',
          text: error.message,
          icon: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Beginning Download...',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        const data: any = {};
        data.name = 'Students';
        data.contents = result.students;
        const emails = result.students.join('\n');
        this.setState({ generatedData: emails });
        const zip = new ZipZap();
        const now = moment().format('YYYY-MM-DD-HH-mm-ss');
        const dir = `radgrad-students${now}`;
        const fileName = `${dir}/Students.txt`;
        zip.file(fileName, emails);
        zip.saveAs(`${dir}.zip`);
      }
    });
    this.setState({ isEmailWorking: false });
  };

  public render() {
    const columnStyle = {
      padding: 2,
    };

    const buttonStyle = {
      overflow: 'hidden',
    };

    const filterFirst = _.filter(this.props.students, s => s.firstName.toLowerCase().includes(this.props.firstName.toLowerCase()));
    const filterLast = _.filter(filterFirst, s => s.lastName.toLowerCase().includes(this.props.lastName.toLowerCase()));
    const filteredStudents = _.filter(filterLast, s => s.username.toLowerCase().includes(this.props.username.toLowerCase()));

    const panes = [
      {
        menuItem: 'Update Existing',
        render: () => <Tab.Pane key={'update'}>
            <Header as="h4" dividing={true}>FILTER STUDENTS</Header>
            <Form onSubmit={this.clearFilter}>
              <Form.Group inline>
                <Form.Field>
                  <Form.Input name="firstName"
                    // @ts-ignore
                              label={{ basic: 'true', children: 'First Name:' }}
                              value={this.props.firstName}
                              onChange={this.handleChangeFirstName}/>
                </Form.Field>
                <Form.Field>
                  <Form.Input name="lastName"
                    // @ts-ignore
                              label={{ basic: 'true', children: 'Last Name:' }}
                              value={this.props.lastName}
                              onChange={this.handleChangeLastName}/>
                </Form.Field>
                <Form.Field>
                  <Form.Input name="userName"
                    // @ts-ignore
                              label={{ basic: 'true', children: 'Username:' }}
                              value={this.props.username}
                              onChange={this.handleChangeUserName}/>
                </Form.Field>
                <Form.Button basic={true} color={'green'} content={'Clear Filter'}/>
              </Form.Group>
            </Form>
            <Header as="h4">{'Header here'}</Header>
            <Tab panes={[
              {
                menuItem: `Students (${this.props.students.length})`,
                render: () => <Tab.Pane>
                    <Grid stackable>
                      {filteredStudents.map((student, index) => (
                        <Grid.Column style={columnStyle} width={3} key={index}>
                          <Popup content={`${student.lastName}, ${student.firstName}`} position='top center'
                                 trigger={<Button basic={true} color={'grey'} fluid={true} style={buttonStyle}
                                                  studentusername={student.username}
                                                  onClick={this.handleSelectStudent}>
                                   <Image avatar src={`/images/level-icons/radgrad-level-${student.level}-icon.png`}/>
                                   {student.lastName}, {student.firstName}<br/>{student.username}
                                 </Button>}/>
                        </Grid.Column>
                      ))}
                    </Grid>
                  </Tab.Pane>,
              },
            ]}/>
          </Tab.Pane>
        ,
      },
      {
        menuItem: 'Add New',
        render: () => <AdvisorAddStudentWidget interests={this.props.interests}
                                               careerGoals={this.props.careerGoals}/>,
      },
      {
        menuItem: 'Bulk STAR Upload',
        render: () => <Tab.Pane key={'upload'}>
            <Header dividing={true} content={'BULK STAR UPLOAD STAR DATA'}/>
            <Form onSubmit={this.handleStarSubmit}>
              <Form.Field>
                <Form.Input type={'file'} onChange={this.readFile} label={'BULK STAR JSON'}/>
              </Form.Field>
              <Form.Group inline={true}>
                <Form.Button size={'tiny'} basic={true} color={'green'} content={'LOAD BULK STAR DATA'}
                             type={'Submit'}
                             loading={this.state.isUploadWorking}
                             disabled={this.state.isUploadWorking || (this.state.fileData === '')}/>
                <Form.Button size={'tiny'} basic={true} color={'green'} content={'GET STUDENT EMAILS'}
                             onClick={this.getStudentEmails}
                             loading={this.state.isEmailWorking}
                             disabled={this.state.isEmailWorking}/>
              </Form.Group>
            </Form>
            {this.state.generatedData ? <Segment>{this.state.generatedData}</Segment> : undefined}
          </Tab.Pane>
        ,
      },
    ];

    return (
      <Segment>
        <Header as="h4" dividing={true}>SELECT STUDENT</Header>
        <Tab panes={panes} onTabChange={this.handleTabChange}/>
      </Segment>
    );
  }
}

const AdvisorStudentSelectorWidgetContainer = withTracker(() => ({
  students: StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch(),
}))(AdvisorStudentSelectorWidget);

export default connect(mapStateToProps)(AdvisorStudentSelectorWidgetContainer);
