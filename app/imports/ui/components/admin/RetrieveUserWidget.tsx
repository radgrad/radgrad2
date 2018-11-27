import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Container, Dropdown, Grid, Header, Image, Label, List, Menu, Segment, Tab } from 'semantic-ui-react';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { updateAllStudentLevelsMethod } from '../../../api/level/LevelProcessor.methods';

function url(user) {
  return `/#/${user.role.toLowerCase()}/${user.username}/home`;
}

function name(user) {
  return `${user.lastName}, ${user.firstName}`;
}

class RetrieveUserWidget extends React.Component {
  private handleUpdateLevelButton(event) {
    updateAllStudentLevelsMethod.call((error, result) => {
      if (error) {
        console.log('There was an error updating the student levels', error);
      }
      console.log(result);
    });
  }

  public render() {
    const advisors = AdvisorProfiles.find({}, { sort: { lastName: 1 } }).fetch();
    const faculty = FacultyProfiles.find({}, { sort: { lastName: 1 } }).fetch();
    const mentors = MentorProfiles.find({}, { sort: { lastName: 1 } }).fetch();
    const students = StudentProfiles.find({ isAlumni: false }, { sort: { lastName: 1 } }).fetch();
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
                  <a className="ui basic grey fluid label" target="_blank" href={url(user)}>{name(user)}</a>
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
                  <a className="ui basic grey fluid label" target="_blank" href={url(user)}>{name(user)}</a>
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
                  <a className="ui basic grey fluid label" target="_blank" href={url(user)}>{name(user)}</a>
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
                  <a className="ui basic grey fluid label" target="_blank" href={url(user)}>
                    {/*<Image src={`/images/level-icons/radgrad-level-${user.level}-icon.png`}/>*/}
                    {name(user)}
                    </a>
                </Grid.Column>
              ))}
              <Grid.Row centered={true}>
                <Button color={'green'} basic={true} style={marginStyle} onClick={this.handleUpdateLevelButton}>Update Student Levels</Button>
              </Grid.Row>
            </Grid>
          </Tab.Pane>
        ),
      },
    ];
    return (
      <Segment padded={true}>
        <Header dividing={true} as="h4">RETRIEVE USER</Header>
        <Tab panes={panes} renderActiveOnly={false} defaultActiveIndex={3} />
      </Segment>
    );
  }
}

export default RetrieveUserWidget;
