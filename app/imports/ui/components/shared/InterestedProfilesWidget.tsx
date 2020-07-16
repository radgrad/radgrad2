import React, { useState } from 'react';
import { Container, Header, Grid, Image, Popup, Divider, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import { Users } from '../../../api/user/UserCollection';
import { IInterest } from '../../../typings/radgrad';
import WidgetHeaderNumber from './WidgetHeaderNumber';
import { studentsParticipating } from './data-model-helper-functions';
import { getUserIDsWithFavoriteInterestMethod } from '../../../api/favorite/FavoriteInterestCollection.methods';

interface IInterestedProfileWidgetProps {
  interest: IInterest;
}

const InterestedProfilesWidget = (props: IInterestedProfileWidgetProps) => {
  // console.log('InterestedProfileWidget', props);
  const [faculty, setFaculty] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const { interest } = props;
  getUserIDsWithFavoriteInterestMethod.call({ interestID: interest._id, role: 'faculty' }, (error, res) => {
    if (res && faculty.length !== res.length) {
      setFaculty(_.map(res, (id) => Users.getProfile(id)));
    }
  });
  getUserIDsWithFavoriteInterestMethod.call({ interestID: interest._id, role: 'mentor' }, (error, res) => {
    if (res && mentors.length !== res.length) {
      setMentors(_.map(res, (id) => Users.getProfile(id)));
    }
  });
  getUserIDsWithFavoriteInterestMethod.call({ interestID: interest._id, role: 'student' }, (error, res) => {
    if (res && students.length !== res.length) {
      setStudents(_.map(res, (id) => Users.getProfile(id)));
    }
  });
  getUserIDsWithFavoriteInterestMethod.call({ interestID: interest._id, role: 'alumni' }, (error, res) => {
    if (res && alumni.length !== res.length) {
      setAlumni(_.map(res, (id) => Users.getProfile(id)));
    }
  });
  const numberStudents = studentsParticipating(interest);
  return (
    <Grid>
      <Grid.Row centered>
        <Grid.Column>
          <Container fluid>
            <Segment>
              <Header as="h5" textAlign="center">
                STUDENTS <WidgetHeaderNumber inputValue={numberStudents} />
              </Header>
              <Divider />
              <Container textAlign="center">
                <Image.Group size="mini">
                  {students.map((student) => (
                    <Popup
                      key={student._id}
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
                FACULTY MEMBERS <WidgetHeaderNumber inputValue={faculty.length} />
              </Header>
              <Divider />
              <Container textAlign="center">
                <Image.Group size="mini">
                  {faculty.map((fac) => (
                    <Popup
                      key={fac._id}
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
                ALUMNI <WidgetHeaderNumber inputValue={alumni.length} />
              </Header>
              <Divider />
              <Container textAlign="center">
                <Image.Group size="mini">
                  {alumni.map((alum) => (
                    <Popup
                      key={alum._id}
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
                MENTORS <WidgetHeaderNumber inputValue={mentors.length} />
              </Header>
              <Divider />
              <Container textAlign="center">
                <Image.Group size="mini">
                  {mentors.map((mentor) => (
                    <Popup
                      key={mentor._id}
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
