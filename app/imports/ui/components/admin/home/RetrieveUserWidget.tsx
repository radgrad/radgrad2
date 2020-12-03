import React from 'react';
import { Button, Grid, Header, Segment, Tab } from 'semantic-ui-react';
import _ from 'lodash';
import { updateAllStudentLevelsMethod } from '../../../../api/level/LevelProcessor.methods';
import { IFilterUsers } from '../../../pages/admin/AdminHomePage';
import { IAdvisorOrFacultyProfile, IStudentProfile } from '../../../../typings/radgrad';

function url(user) {
  return `/#/${user.role.toLowerCase()}/${user.username}/home`;
}

function name(user) {
  return `${user.lastName}, ${user.firstName}`;
}

const shortUserName = (user) => user.username.substr(0, user.username.indexOf('@'));

interface IRetrieveUserWidgetProps extends IFilterUsers {
  advisors: IAdvisorOrFacultyProfile[];
  faculty: IAdvisorOrFacultyProfile[];
  students: IStudentProfile[];
  alumni: IStudentProfile[];
  firstNameRegex?: string;
  lastNameRegex?: string;
  userNameRegex?: string;
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
  let students = props.students;
  let alumni = props.alumni;
  let regex = new RegExp(props.firstNameRegex);
  advisors = _.filter(advisors, (u) => regex.test(u.firstName));
  faculty = _.filter(faculty, (u) => regex.test(u.firstName));
  students = _.filter(students, (u) => regex.test(u.firstName));
  alumni = _.filter(alumni, (u) => regex.test(u.firstName));
  regex = new RegExp(props.lastNameRegex);
  advisors = _.filter(advisors, (u) => regex.test(u.lastName));
  faculty = _.filter(faculty, (u) => regex.test(u.lastName));
  students = _.filter(students, (u) => regex.test(u.lastName));
  alumni = _.filter(alumni, (u) => regex.test(u.lastName));
  regex = new RegExp(props.userNameRegex);
  advisors = _.filter(advisors, (u) => regex.test(u.username));
  faculty = _.filter(faculty, (u) => regex.test(u.username));
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
                <a
                  id={shortUserName(user)}
                  className="ui basic grey fluid label"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={url(user)}
                >
                  {name(user)}
                </a>
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
                <a
                  id={shortUserName(user)}
                  className="ui basic grey fluid label"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={url(user)}
                >
                  {name(user)}
                </a>
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
                <a id={shortUserName(user)} className="ui basic grey fluid label" rel="noopener noreferrer" target="_blank" href={url(user)}>
                  {/* <Image src={`/images/level-icons/radgrad-level-${user.level}-icon.png`}/> */}
                  {name(user)}
                </a>
              </Grid.Column>
            ))}
            <Grid.Row centered>
              <Button color="green" basic style={marginStyle} onClick={handleUpdateLevelButton}>
                Update Student
                Levels
              </Button>
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
                <a id={shortUserName(user)} className="ui basic grey fluid label" rel="noopener noreferrer" target="_blank" href={url(user)}>
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
    <Segment padded>
      <Header dividing as="h4">RETRIEVE USER</Header>
      <Tab panes={panes} renderActiveOnly={false} defaultActiveIndex={2} />
    </Segment>
  );
};

export default RetrieveUserWidget;
