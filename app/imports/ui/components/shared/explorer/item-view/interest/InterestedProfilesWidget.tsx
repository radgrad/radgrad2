import React, { useState } from 'react';
import { Container, Header, Grid, Image, Popup, Divider, Segment } from 'semantic-ui-react';
import { ROLE } from '../../../../../../api/role/Role';
import { Users } from '../../../../../../api/user/UserCollection';
import { Interest } from '../../../../../../typings/radgrad';
import WidgetHeaderNumber from '../../WidgetHeaderNumber';
import { studentsParticipating } from '../../../utilities/data-model';
import { getUserIDsWithProfileInterestMethod } from '../../../../../../api/user/profile-entries/ProfileInterestCollection.methods';

interface nterestedProfileWidgetProps {
  interest: Interest;
}

const InterestedProfilesWidget: React.FC<nterestedProfileWidgetProps> = ({ interest }) => {
  // console.log('InterestedProfileWidget', props);
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [advisor, setAdvisor] = useState([]);
  getUserIDsWithProfileInterestMethod.call({ interestID: interest._id, role: ROLE.FACULTY }, (error, res) => {
    if (res && faculty.length !== res.length) {
      setFaculty(res.map((id) => Users.getProfile(id)));
    }
  });
  getUserIDsWithProfileInterestMethod.call({ interestID: interest._id, role: ROLE.STUDENT }, (error, res) => {
    if (res && students.length !== res.length) {
      setStudents(res.map((id) => Users.getProfile(id)));
    }
  });
  getUserIDsWithProfileInterestMethod.call({ interestID: interest._id, role: ROLE.ADVISOR }, (error, res) => {
    if (res && advisor.length !== res.length) {
      setAdvisor(res.map((id) => Users.getProfile(id)));
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
                    <Popup key={student._id} trigger={<Image src={student.picture} circular size="mini" />} content={`${student.firstName} ${student.lastName}`} />
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
                    <Popup key={fac._id} trigger={<Image src={fac.picture} circular />} content={`${fac.firstName} ${fac.lastName}`} />
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
                ADVISORS <WidgetHeaderNumber inputValue={advisor.length} />
              </Header>
              <Divider />
              <Container textAlign="center">
                <Image.Group size="mini">
                  {advisor.map((adv) => (
                    <Popup key={adv._id} trigger={<Image src={adv.picture} circular />} content={`${adv.firstName} ${adv.lastName}`} />
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
