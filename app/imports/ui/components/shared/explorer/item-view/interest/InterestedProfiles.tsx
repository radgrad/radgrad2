import React, { useState } from 'react';
import { Container, Header, Divider, Segment } from 'semantic-ui-react';
import { ROLE } from '../../../../../../api/role/Role';
import { Users } from '../../../../../../api/user/UserCollection';
import { Interest } from '../../../../../../typings/radgrad';
import UserLabel from '../../../profile/UserLabel';
import WidgetHeaderNumber from '../../WidgetHeaderNumber';
import { getUserIDsWithProfileExplorerMethod } from '../../../../../../api/user/profile-entries/ProfileExplorerCollection.methods';

interface InterestedProfileWidgetProps {
  interest: Interest;
}

const InterestedProfiles: React.FC<InterestedProfileWidgetProps> = ({ interest }) => {
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [advisors, setAdvisors] = useState([]);

  getUserIDsWithProfileExplorerMethod.call({ interestID: interest._id, role: ROLE.FACULTY }, (error, res) => {
    if (res && faculty.length !== res.length) {
      setFaculty(res.map((id) => Users.getProfile(id)));
    }
  });
  getUserIDsWithProfileExplorerMethod.call({ interestID: interest._id, role: ROLE.STUDENT }, (error, res) => {
    if (res && students.length !== res.length) {
      setStudents(res.map((id) => Users.getProfile(id)));
    }
  });
  getUserIDsWithProfileExplorerMethod.call({ interestID: interest._id, role: ROLE.ADVISOR }, (error, res) => {
    if (res && advisors.length !== res.length) {
      setAdvisors(res.map((id) => Users.getProfile(id)));
    }
  });

  const numberStudents = students.length;
  return (
    <Segment>
      <Header as="h5" textAlign="center">
        STUDENTS <WidgetHeaderNumber inputValue={numberStudents} />
      </Header>
      <Container textAlign="center">
        {students.map((student) => (
          <UserLabel key={student.username} username={student.username} />
        ))}
      </Container>
      <Divider />
      <Header as="h5" textAlign="center">
        FACULTY MEMBERS <WidgetHeaderNumber inputValue={faculty.length} />
      </Header>
      <Container textAlign="center">
        {faculty.map((fac) => (
          <UserLabel username={fac.username} key={fac.username} />
        ))}
      </Container>
      <Divider />
      <Header as="h5" textAlign="center">
        ADVISORS <WidgetHeaderNumber inputValue={advisors.length} />
      </Header>
      <Container textAlign="center">
          {advisors.map((fac) => (
            <UserLabel username={fac.username} key={fac.username} />
          ))}
      </Container>
    </Segment>
  );
};

export default InterestedProfiles;
