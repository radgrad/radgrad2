import React, { useState } from 'react';
import { Container, Header, Image, Popup, Divider, Segment } from 'semantic-ui-react';
import { ROLE } from '../../../../../../api/role/Role';
import { Users } from '../../../../../../api/user/UserCollection';
import { Interest } from '../../../../../../typings/radgrad';
import WidgetHeaderNumber from '../../WidgetHeaderNumber';
import { studentsParticipating } from '../../../utilities/data-model';
import { getUserIDsWithProfileInterestMethod } from '../../../../../../api/user/profile-entries/ProfileInterestCollection.methods';

interface InterestedProfileWidgetProps {
  interest: Interest;
}

const InterestedProfiles: React.FC<InterestedProfileWidgetProps> = ({ interest }) => {
  // console.log('InterestedProfileWidget', props);
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [advisors, setAdvisors] = useState([]);

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
    if (res && advisors.length !== res.length) {
      setAdvisors(res.map((id) => Users.getProfile(id)));
    }
  });

  const numberStudents = studentsParticipating(interest);
  return (
            <Segment>
              <Header as="h5" textAlign="center">
                STUDENTS <WidgetHeaderNumber inputValue={numberStudents} />
              </Header>
              <Container textAlign="center">
                <Image.Group size="mini">
                  {/* TODO replace with profile labels */}
                  {students.map((student) => (
                    <Popup key={student._id} trigger={<Image src={student.picture} circular size="mini" />} content={`${student.firstName} ${student.lastName}`} />
                  ))}
                </Image.Group>
              </Container>
              <Divider />
              <Header as="h5" textAlign="center">
                FACULTY MEMBERS <WidgetHeaderNumber inputValue={faculty.length} />
              </Header>
              <Container textAlign="center">
                <Image.Group size="mini">
                  {faculty.map((fac) => (
                    <Popup key={fac._id} trigger={<Image src={fac.picture} circular />} content={`${fac.firstName} ${fac.lastName}`} />
                  ))}
                </Image.Group>
              </Container>
              <Divider />
              <Header as="h5" textAlign="center">
                ADVISORS <WidgetHeaderNumber inputValue={advisors.length} />
              </Header>
              <Container textAlign="center">
                <Image.Group size="mini">
                  {advisors.map((fac) => (
                    <Popup key={fac._id} trigger={<Image src={fac.picture} circular />} content={`${fac.firstName} ${fac.lastName}`} />
                  ))}
                </Image.Group>
              </Container>
            </Segment>
  );
};

export default InterestedProfiles;
