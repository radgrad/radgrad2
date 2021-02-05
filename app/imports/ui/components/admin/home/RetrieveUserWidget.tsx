import React from 'react';
import { Button, Grid, Header, Segment, Tab } from 'semantic-ui-react';
import _ from 'lodash';
import { updateAllStudentLevelsMethod } from '../../../../api/level/LevelProcessor.methods';
import { FilterUsers } from '../../../pages/admin/AdminHomePage'; // TODO resolve circular imports
import { AdvisorOrFacultyProfile, StudentProfile } from '../../../../typings/radgrad';

function url(user) {
  return `/#/${user.role.toLowerCase()}/${user.username}/checklists`;
}

function name(user) {
  return `${user.lastName}, ${user.firstName}`;
}

const shortUserName = (user) => user.username.substr(0, user.username.indexOf('@'));

interface RetrieveUserWidgetProps extends FilterUsers {
  advisors: AdvisorOrFacultyProfile[];
  faculty: AdvisorOrFacultyProfile[];
  students: StudentProfile[];
  alumni: StudentProfile[];
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

const RetrieveUserWidget: React.FC<RetrieveUserWidgetProps> = ({ advisors, faculty, students, alumni, firstNameRegex, lastNameRegex, userNameRegex }) => {
  let advisorsToShow = advisors;
  let facultyToShow = faculty;
  let studentsToShow = students;
  let alumniToShow = alumni;
  let regex = new RegExp(firstNameRegex);
  advisorsToShow = _.filter(advisorsToShow, (u) => regex.test(u.firstName));
  facultyToShow = _.filter(facultyToShow, (u) => regex.test(u.firstName));
  studentsToShow = _.filter(studentsToShow, (u) => regex.test(u.firstName));
  alumniToShow = _.filter(alumniToShow, (u) => regex.test(u.firstName));
  regex = new RegExp(lastNameRegex);
  advisorsToShow = _.filter(advisorsToShow, (u) => regex.test(u.lastName));
  facultyToShow = _.filter(facultyToShow, (u) => regex.test(u.lastName));
  studentsToShow = _.filter(studentsToShow, (u) => regex.test(u.lastName));
  alumniToShow = _.filter(alumniToShow, (u) => regex.test(u.lastName));
  regex = new RegExp(userNameRegex);
  advisorsToShow = _.filter(advisorsToShow, (u) => regex.test(u.username));
  facultyToShow = _.filter(facultyToShow, (u) => regex.test(u.username));
  studentsToShow = _.filter(studentsToShow, (u) => regex.test(u.username));
  alumniToShow = _.filter(alumniToShow, (u) => regex.test(u.username));
  const linkStyle = { padding: 2 };
  const marginStyle = { margin: 10 };
  const panes = [
    {
      menuItem: `Advisors (${advisorsToShow.length})`,
      pane: (
        <Tab.Pane key="advisors">
          <Grid>
            {advisorsToShow.map((user) => (
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
    {
      menuItem: `Faculty (${facultyToShow.length})`,
      pane: (
        <Tab.Pane key="faculty">
          <Grid>
            {facultyToShow.map((user) => (
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
    {
      menuItem: `Students (${studentsToShow.length})`,
      pane: (
        <Tab.Pane key="Students">
          <Grid>
            {studentsToShow.map((user) => (
              <Grid.Column key={user._id} width={2} style={linkStyle}>
                <a id={shortUserName(user)} className="ui basic grey fluid label" rel="noopener noreferrer" target="_blank" href={url(user)}>
                  {/* <Image src={`/images/level-icons/radgrad-level-${user.level}-icon.png`}/> */}
                  {name(user)}
                </a>
              </Grid.Column>
            ))}
            <Grid.Row centered>
              <Button color="green" basic style={marginStyle} onClick={handleUpdateLevelButton}>
                Update Student Levels
              </Button>
            </Grid.Row>
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: `Alumni (${alumniToShow.length})`,
      pane: (
        <Tab.Pane key="Alumni">
          <Grid>
            {alumniToShow.map((user) => (
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
      <Header dividing as="h4">
        RETRIEVE USER
      </Header>
      <Tab panes={panes} renderActiveOnly={false} defaultActiveIndex={2} />
    </Segment>
  );
};

export default RetrieveUserWidget;
