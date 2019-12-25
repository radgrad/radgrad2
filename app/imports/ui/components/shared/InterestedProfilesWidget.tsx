import React from 'react';
import { Container, Header, Grid, Image, Popup, Divider, Segment } from 'semantic-ui-react';
import { IInterest, IProfile } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import WidgetHeaderNumber from './WidgetHeaderNumber';
import { studentsParticipating } from './data-model-helper-functions';

interface IInterestedProfileWidgetProps {
  interest: IInterest;
  students: IProfile[];
  faculty: IProfile[];
  alumni: IProfile[];
  mentors: IProfile[];
}

const InterestedProfilesWidget = (props: IInterestedProfileWidgetProps) => {
  const { interest, students, faculty, alumni, mentors } = props;
  const numberStudents = studentsParticipating(interest);
  return (
    <Grid>
      <Grid.Row centered>
        <Grid.Column>
          <Container fluid>
            <Segment>
              <Header as="h5" textAlign="center">
STUDENTS
                <WidgetHeaderNumber inputValue={numberStudents} />
              </Header>
              <Divider />
              <Container textAlign="center">
                <Image.Group size="mini">
                  {students.map((student, index) => (
                    <Popup
                      key={index}
                      trigger={<Image src={student.picture} circular size="mini" />}
                      content={`${student.firstName} ${student.lastName}`}
                    />
))}
                </Image.Group>
              </Container>
            </Segment>
          </Container>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Container fluid>
            <Segment>
              <Header as="h5" textAlign="center">
FACULTY MEMBERS
                <WidgetHeaderNumber
                  inputValue={faculty.length}
                />
              </Header>
              <Divider />
              <Container textAlign="center">
                <Image.Group size="mini">
                  {faculty.map((fac, index) => (
                    <Popup
                      key={index}
                      trigger={<Image src={fac.picture} circular />}
                      content={`${fac.firstName} ${fac.lastName}`}
                    />
))}
                </Image.Group>
              </Container>
            </Segment>
          </Container>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Container>
            <Segment>
              <Header as="h5" textAlign="center">
ALUMNI
                <WidgetHeaderNumber inputValue={alumni.length} />
              </Header>
              <Divider />
              <Container textAlign="center">
                <Image.Group size="mini">
                  {alumni.map((alum, index) => (
                    <Popup
                      key={index}
                      trigger={<Image src={alum.picture} circular />}
                      content={`${alum.firstName} ${alum.lastName}`}
                    />
))}
                </Image.Group>
              </Container>
            </Segment>
          </Container>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Container>
            <Segment>
              <Header as="h5" textAlign="center">
MENTORS
                <WidgetHeaderNumber inputValue={mentors.length} />
              </Header>
              <Divider />
              <Container textAlign="center">
                <Image.Group size="mini">
                  {mentors.map((mentor, index) => (
                    <Popup
                      key={index}
                      trigger={<Image src={mentor.picture} circular />}
                      content={`${mentor.firstName} ${mentor.lastName}`}
                    />
))}
                </Image.Group>
              </Container>
            </Segment>
          </Container>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default InterestedProfilesWidget;
