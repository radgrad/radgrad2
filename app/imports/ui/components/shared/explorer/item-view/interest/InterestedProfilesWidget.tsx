import React, { useState } from 'react';
import { Container, Header, Grid, Image, Popup, Divider, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import { ROLE } from '../../../../../../api/role/Role';
import { Users } from '../../../../../../api/user/UserCollection';
import { IInterest } from '../../../../../../typings/radgrad';
import WidgetHeaderNumber from '../../WidgetHeaderNumber';
import { studentsParticipating } from '../../../utilities/data-model';
import { getUserIDsWithFavoriteInterestMethod } from '../../../../../../api/favorite/FavoriteInterestCollection.methods';

interface IInterestedProfileWidgetProps {
  interest: IInterest;
}

const InterestedProfilesWidget: React.FC<IInterestedProfileWidgetProps> = ({ interest }) => {
  // console.log('InterestedProfileWidget', props);
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [advisor, setAdvisor] = useState([]);
  getUserIDsWithFavoriteInterestMethod.call({ interestID: interest._id, role: ROLE.FACULTY }, (error, res) => {
    if (res && faculty.length !== res.length) {
      setFaculty(_.map(res, (id) => Users.getProfile(id)));
    }
  });
  getUserIDsWithFavoriteInterestMethod.call({ interestID: interest._id, role: ROLE.STUDENT }, (error, res) => {
    if (res && students.length !== res.length) {
      setStudents(_.map(res, (id) => Users.getProfile(id)));
    }
  });
  getUserIDsWithFavoriteInterestMethod.call({ interestID: interest._id, role: ROLE.ADVISOR }, (error, res) => {
    if (res && advisor.length !== res.length) {
      setAdvisor(_.map(res, (id) => Users.getProfile(id)));
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
                ADVISORS <WidgetHeaderNumber inputValue={advisor.length} />
              </Header>
              <Divider />
              <Container textAlign="center">
                <Image.Group size="mini">
                  {advisor.map((adv) => (
                    <Popup
                      key={adv._id}
                      trigger={<Image src={adv.picture} circular />}
                      content={`${adv.firstName} ${adv.lastName}`}
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
