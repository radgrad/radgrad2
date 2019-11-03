import * as React from 'react';
import { Button, Grid, Header, Segment, Tab } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { updateAllStudentLevelsMethod } from '../../../api/level/LevelProcessor.methods';
import { IFilterUsers } from '../../pages/admin/AdminHomePage'; // eslint-disable-line
import { IAdvisorProfile, IFacultyProfile, IMentorProfile, IStudentProfile } from '../../../typings/radgrad'; // eslint-disable-line

function url(user) {
  return `/#/${user.role.toLowerCase()}/${user.username}/home`;
}

function name(user) {
  return `${user.lastName}, ${user.firstName}`;
}

interface IRetrieveUserWidgetProps extends IFilterUsers {
  advisors: IAdvisorProfile[];
  faculty: IFacultyProfile[];
  mentors: IMentorProfile[];
  students: IStudentProfile[];
  alumni: IStudentProfile[];
}

const handleUpdateLevelButton = (event) => {
  event.preventDefault();
  updateAllStudentLevelsMethod.call((error, result) => {
    if (error) {
      console.error('There was an error updating the student levels', error);
    }
    console.log(result);
  });
};


const RetrieveUserWidget = (props: IRetrieveUserWidgetProps) => {
  let advisors = props.advisors;
  let faculty = props.faculty;
  let mentors = props.mentors;
  let students = props.students;
  let alumni = props.alumni;
  let regex = new RegExp(props.firstNameRegex);
  advisors = _.filter(advisors, (u) => regex.test(u.firstName));
  faculty = _.filter(faculty, (u) => regex.test(u.firstName));
  mentors = _.filter(mentors, (u) => regex.test(u.firstName));
  students = _.filter(students, (u) => regex.test(u.firstName));
  alumni = _.filter(alumni, (u) => regex.test(u.firstName));
  regex = new RegExp(props.lastNameRegex);
  advisors = _.filter(advisors, (u) => regex.test(u.lastName));
  faculty = _.filter(faculty, (u) => regex.test(u.lastName));
  mentors = _.filter(mentors, (u) => regex.test(u.lastName));
  students = _.filter(students, (u) => regex.test(u.lastName));
  alumni = _.filter(alumni, (u) => regex.test(u.lastName));
  regex = new RegExp(props.userNameRegex);
  advisors = _.filter(advisors, (u) => regex.test(u.username));
  faculty = _.filter(faculty, (u) => regex.test(u.username));
  mentors = _.filter(mentors, (u) => regex.test(u.username));
  students = _.filter(students, (u) => regex.test(u.username));
  alumni = _.filter(alumni, (u) => regex.test(u.username));
  const linkStyle = { padding: 2 };
  const marginStyle = { margin: 10 };
  const panes = [
    {
      menuItem: `Advisors (${advisors.length})`,
      pane: (
        <Tab.Pane key="advisors">
          <Grid>
            {advisors.map((user) => (
              <Grid.Column key={user._id} width={2} style={linkStyle}>
                <a className="ui basic grey fluid label" rel="noopener noreferrer" target="_blank"
                   href={url(user)}>{name(user)}</a>
              </Grid.Column>
            ))}
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: `Faculty (${faculty.length})`,
      pane: (
        <Tab.Pane key="faculty">
          <Grid>
            {faculty.map((user) => (
              <Grid.Column key={user._id} width={2} style={linkStyle}>
                <a className="ui basic grey fluid label" rel="noopener noreferrer" target="_blank"
                   href={url(user)}>{name(user)}</a>
              </Grid.Column>
            ))}
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: `Mentors (${mentors.length})`,
      pane: (
        <Tab.Pane key="Mentors">
          <Grid>
            {mentors.map((user) => (
              <Grid.Column key={user._id} width={2} style={linkStyle}>
                <a className="ui basic grey fluid label" rel="noopener noreferrer" target="_blank"
                   href={url(user)}>{name(user)}</a>
              </Grid.Column>
            ))}
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: `Students (${students.length})`,
      pane: (
        <Tab.Pane key="Students">
          <Grid>
            {students.map((user) => (
              <Grid.Column key={user._id} width={2} style={linkStyle}>
                <a className="ui basic grey fluid label" rel="noopener noreferrer" target="_blank" href={url(user)}>
                  {/* <Image src={`/images/level-icons/radgrad-level-${user.level}-icon.png`}/> */}
                  {name(user)}
                </a>
              </Grid.Column>
            ))}
            <Grid.Row centered={true}>
              <Button color={'green'} basic={true} style={marginStyle} onClick={handleUpdateLevelButton}>Update Student
                Levels</Button>
            </Grid.Row>
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: `Alumni (${alumni.length})`,
      pane: (
        <Tab.Pane key="Alumni">
          <Grid>
            {alumni.map((user) => (
              <Grid.Column key={user._id} width={2} style={linkStyle}>
                <a className="ui basic grey fluid label" rel="noopener noreferrer" target="_blank" href={url(user)}>
                  {name(user)}
                </a>
              </Grid.Column>
            ))}
          </Grid>
        </Tab.Pane>
      ),
    },
  ];
  return (
    <Segment padded={true}>
      <Header dividing={true} as="h4">RETRIEVE USER</Header>
      <Tab panes={panes} renderActiveOnly={false} defaultActiveIndex={3}/>
    </Segment>
  );
};

const RetrieveUserWidgetContainer = withTracker(() => {
  const advisors = AdvisorProfiles.find({}, { sort: { lastName: 1 } }).fetch();
  const faculty = FacultyProfiles.find({}, { sort: { lastName: 1 } }).fetch();
  const mentors = MentorProfiles.find({}, { sort: { lastName: 1 } }).fetch();
  const students = StudentProfiles.find({ isAlumni: false }, { sort: { lastName: 1 } }).fetch();
  const alumni = StudentProfiles.find({ isAlumni: true }, { sort: { lastName: 1 } }).fetch();
  return {
    advisors,
    faculty,
    mentors,
    students,
    alumni,
  };
})(RetrieveUserWidget);

export default RetrieveUserWidgetContainer;
